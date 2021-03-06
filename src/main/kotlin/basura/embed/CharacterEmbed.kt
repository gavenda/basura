package basura.embed

import basura.abbreviate
import basura.aniClean
import basura.appendIfNotMax
import basura.graphql.anilist.Character
import basura.weirdHtmlClean
import dev.kord.common.Color
import dev.kord.rest.builder.message.EmbedBuilder

fun createCharacterEmbed(character: Character): EmbedBuilder.() -> Unit = {
    val animeAppearance = StringBuilder()
    val mangaAppearance = StringBuilder()

    val mediaNodes = character.media?.nodes
    val mediaEdges = character.media?.edges

    if (mediaNodes != null && mediaEdges != null) {
        mediaNodes.zip(mediaEdges).forEach { pair ->
            val (media, edge) = pair
            // Ensure not null
            if (media != null && edge != null) {
                val mediaTitle = media.title?.english ?: media.title?.romaji
                val appearance = "- [${mediaTitle}](${media.siteUrl}) [${edge.characterRole?.displayName}]\n"

                when (media.type) {
                    basura.graphql.anilist.MediaType.ANIME -> {
                        animeAppearance.appendIfNotMax(appearance, EmbedBuilder.Field.Limits.name)
                    }
                    basura.graphql.anilist.MediaType.MANGA -> {
                        mangaAppearance.appendIfNotMax(appearance, EmbedBuilder.Field.Limits.name)
                    }
                    // Do nothing
                    else -> {}
                }
            }
        }
    }

    // Weirdly enough, duplicate names exists.
    val aliases = buildString {
        character.name?.alternative
            ?.filterNotNull()
            ?.filter { it.isNotEmpty() }
            ?.distinctBy { it }
            ?.forEach {
                appendIfNotMax("- ${it.trimEnd()}\n", EmbedBuilder.Field.Limits.name)
            }
    }

    title = buildString {
        val native = character.name?.native
        append(character.name?.full)
        if (native != null) {
            append(" (${native})")
        }
    }
    // Remove spoilers, fix new lines, clean up html bullshit
    description = character.description
        .replace(Regex("(?s)~!.*?!~"), "")
        .replace("\n\n\n", "\n")
        .aniClean()
        .weirdHtmlClean()
        .abbreviate(EmbedBuilder.Limits.description)
        .dropLastWhile { it != '\n' }

    thumbnail {
        url = character.image?.large ?: ""
    }

    url = character.siteUrl
    color = Color(0xFF0000)

    if (animeAppearance.isNotBlank()) {
        field {
            name = "Anime Appearances"
            value = animeAppearance
                .toString()
                .abbreviate(EmbedBuilder.Field.Limits.name)
                .dropLastWhile { it != '\n' }
            inline = false
        }
    }

    if (mangaAppearance.isNotBlank()) {
        field {
            name = "Manga Appearances"
            value = mangaAppearance
                .toString()
                .abbreviate(EmbedBuilder.Field.Limits.name)
                .dropLastWhile { it != '\n' }
            inline = false
        }
    }

    if (aliases.isNotBlank()) {
        field {
            name = "Aliases"
            value = aliases
                .abbreviate(EmbedBuilder.Field.Limits.name)
            inline = false
        }
    }

    field {
        name = "Favorites"
        value = character.favourites.toString()
        inline = true
    }
}

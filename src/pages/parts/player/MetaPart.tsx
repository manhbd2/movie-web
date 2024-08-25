import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAsync } from "react-use";
import type { AsyncReturnType } from "type-fest";

import { DetailedMeta, getMetaFromRequest } from "@/backend/metadata/getmeta";
import { IServer, MWMediaType, MetaRequest } from "@/backend/metadata/types/mw";
import { TMDBContentTypes } from "@/backend/metadata/types/tmdb";
import { getServers } from "@/backend/metadata/vidsrc";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Loading } from "@/components/layout/Loading";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";

export interface MetaPartProps {
  onGetMeta?: (meta: DetailedMeta, episodeId?: string) => void;
}

export function MetaPart(props: MetaPartProps) {
  const { t } = useTranslation();
  const params = useParams<{
    id: string;
    type: TMDBContentTypes;
    episode?: string;
    season?: string;
  }>();
  const { id, type } = params;
  const navigate = useNavigate();

  const { error, value, loading } = useAsync(async () => {
    if (!id || !type) {
      return null;
    }
    if (params.season && Number.isNaN(params.season)) {
      return null;
    }
    if (params.episode && Number.isNaN(params.episode)) {
      return null;
    }

    const request: MetaRequest = {
      id,
      type,
      season: Number(params.season),
      episode: Number(params.episode),
    };
    const meta: AsyncReturnType<typeof getMetaFromRequest> =
      await getMetaFromRequest(request);
    if (!meta) return null;

    const servers: IServer[] = await getServers(request);
    if (!servers?.length) {
      return null;
    }

    meta.servers = servers;
    if (meta.meta.type !== MWMediaType.SERIES) {
      props.onGetMeta?.(meta);
      return;
    }

    const {
      meta: { seasonData },
    } = meta;
    const { episodes } = seasonData;
    const seasonNumber = seasonData.number;
    const episodeNumber = episodes[0].number;

    // not season and not episode
    if (!params.season && !params.episode) {
      navigate(`/embed/${type}/${id}/${seasonNumber}/${episodeNumber}`, {
        replace: true,
      });
      props.onGetMeta?.(meta, episodes[0].id);
      return;
    }

    // replace link with new link if youre not already on the right link
    let episodeId: string = "";
    if (params.episode && Number.isNaN(params.episode)) {
      const episode = episodes.find(
        (i) => i.number.toString() === params.episode,
      );
      if (!episode?.id) return null;
      episodeId = episode.id;
    } else {
      episodeId = episodes[0].id;
      navigate(`/embed/${type}/${id}/${seasonNumber}/${episodes[0].number}`, {
        replace: true,
      });
    }

    props.onGetMeta?.(meta, episodeId);
  }, []);

  if (error && error.message === "dmca") {
    return (
      <ErrorLayout>
        <ErrorContainer>
          <IconPill icon={Icons.DRAGON}>Removed</IconPill>
          <Title>Media has been removed</Title>
          <Paragraph>
            This media is no longer available due to a takedown notice or
            copyright claim.
          </Paragraph>
        </ErrorContainer>
      </ErrorLayout>
    );
  }

  if (error) {
    return (
      <ErrorLayout>
        <ErrorContainer>
          <IconPill icon={Icons.WAND}>
            {t("player.metadata.failed.badge")}
          </IconPill>
          <Title>{t("player.metadata.failed.title")}</Title>
          <Paragraph>{t("player.metadata.failed.text")}</Paragraph>
        </ErrorContainer>
      </ErrorLayout>
    );
  }

  if (!value && !loading) {
    return (
      <ErrorLayout>
        <ErrorContainer>
          <IconPill icon={Icons.WAND}>
            {t("player.metadata.notFound.badge")}
          </IconPill>
          <Title>{t("player.metadata.notFound.title")}</Title>
          <Paragraph>{t("player.metadata.notFound.text")}</Paragraph>
        </ErrorContainer>
      </ErrorLayout>
    );
  }

  return (
    <ErrorLayout>
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    </ErrorLayout>
  );
}

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAsync } from "react-use";
import type { AsyncReturnType } from "type-fest";

import {
  fetchMetadata,
  setCachedMetadata,
} from "@/backend/helpers/providerApi";
import { DetailedMeta, getMetaFromRequest } from "@/backend/metadata/getmeta";
import { MWMediaType, MetaRequest } from "@/backend/metadata/types/mw";
import { TMDBContentTypes } from "@/backend/metadata/types/tmdb";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Loading } from "@/components/layout/Loading";
import { Paragraph } from "@/components/text/Paragraph";
import { Title } from "@/components/text/Title";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { getLoadbalancedProviderApiUrl, providers } from "@/utils/providers";

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
  const navigate = useNavigate();

  const { error, value, loading } = useAsync(async () => {
    const providerApiUrl = getLoadbalancedProviderApiUrl();
    if (providerApiUrl) {
      await fetchMetadata(providerApiUrl);
    } else {
      setCachedMetadata([
        ...providers.listSources(),
        ...providers.listEmbeds(),
      ]);
    }

    if (!params.id || !params.type) {
      return null;
    }
    if (params.season && Number.isNaN(params.season)) {
      return null;
    }
    if (params.episode && Number.isNaN(params.episode)) {
      return null;
    }

    const request: MetaRequest = {
      id: params.id,
      type: params.type,
      season: Number(params.season),
      episode: Number(params.episode),
    };
    const meta: AsyncReturnType<typeof getMetaFromRequest> =
      await getMetaFromRequest(request);
    if (!meta) return null;

    // replace link with new link if youre not already on the right link
    let epId = params.episode;
    if (meta.meta.type === MWMediaType.SERIES) {
      let ep = meta.meta.seasonData.episodes.find(
        (v) => v.id === params.episode,
      );
      if (!ep) ep = meta.meta.seasonData.episodes[0];
      epId = ep.id;
      if (
        params.season !== meta.meta.seasonData.id ||
        params.episode !== ep.id
      ) {
        navigate(`/embed/${params.type}/${meta.meta.seasonData.id}/${ep.id}`, {
          replace: true,
        });
      }
    }

    props.onGetMeta?.(meta, epId);
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

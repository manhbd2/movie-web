import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Title } from "@/components/text/Title";
import { Paragraph } from "@/components/utils/Text";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";

export function NotFoundPart() {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-1 flex-col">
      <Helmet>
        <title>{t("notFound.badge")}</title>
      </Helmet>
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        <ErrorLayout>
          <ErrorContainer>
            <IconPill icon={Icons.EYE_SLASH}>{t("notFound.badge")}</IconPill>
            <Title>{t("notFound.title")}</Title>
            <Paragraph>{t("notFound.message")}</Paragraph>
          </ErrorContainer>
        </ErrorLayout>
      </div>
    </div>
  );
}

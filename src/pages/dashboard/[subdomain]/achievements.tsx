import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import type { ReactElement } from "react"

import { AchievementItem } from "~/components/common/AchievementItem"
import { DashboardLayout } from "~/components/dashboard/DashboardLayout"
import { getServerSideProps as getLayoutServerSideProps } from "~/components/dashboard/DashboardLayout.server"
import { DashboardMain } from "~/components/dashboard/DashboardMain"
import { serverSidePropsHandler } from "~/lib/server-side-props"
import { useGetAchievements, useGetSite } from "~/queries/site"

export const getServerSideProps: GetServerSideProps = serverSidePropsHandler(
  async (ctx) => {
    const { props: layoutProps } = await getLayoutServerSideProps(ctx)

    return {
      props: {
        ...layoutProps,
      },
    }
  },
)

export default function AchievementsPage() {
  const router = useRouter()
  const subdomain = router.query.subdomain as string
  const site = useGetSite(subdomain)

  const achievement = useGetAchievements(site.data?.characterId)

  return (
    <DashboardMain title="Achievements">
      <div className="min-w-[270px] max-w-screen-lg flex flex-col space-y-8">
        <>
          {achievement.data?.list?.map((series) => {
            let length = series.groups?.length
            if (!length) {
              return null
            }
            return (
              <div key={series.info.name}>
                <div className="text-lg font-medium mb-4">
                  {series.info.title}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-x-2 gap-y-5">
                  {series.groups?.map((group) => (
                    <AchievementItem
                      group={group}
                      key={group.info.name}
                      layoutId="achievements"
                      size={80}
                      characterId={site.data?.characterId}
                      isOwner={true}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </>
      </div>
    </DashboardMain>
  )
}

AchievementsPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout title="Achievements">{page}</DashboardLayout>
}

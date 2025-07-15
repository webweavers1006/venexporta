import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamList } from "@components/organisms/teamList/TeamList"

function CardTeamList({ title, description, members }) {
  return (
    <Card className="w-full text-white shadow-none">
      <CardHeader>
        <CardTitle className="text-zinc-700">{title}</CardTitle>
        <CardDescription className="text-zinc-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TeamList members={members} />
      </CardContent>
    </Card>
  )
}

export default CardTeamList;


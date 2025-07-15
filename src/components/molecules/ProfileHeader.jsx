import { Avatar } from "../atoms/AtomsAvatar"
import { Badge } from "../atoms/AtomsBadge"

export function ProfileHeader({ name, isPro, isModerator, avatarUrl }) {
  return (
    <div className="flex items-start gap-4">
      <Avatar src={avatarUrl} alt={name} />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-600">{name}</h1>
        </div>
        {isPro && <Badge variant="pro">{isPro}</Badge>}
        <br />
        {isModerator && <Badge variant="moderator">{isModerator}</Badge>}
      </div>
    </div>
  )
}
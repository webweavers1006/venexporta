import { Avatar } from "@components/atoms/Avatar"
import { Text } from "@components/atoms/text"
import { MemberDropdown } from "@components/molecules/SelectRole"

export function MemberItem({ name, email, avatarSrc, role }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar src={avatarSrc} alt={name} fallback={initials} />
        <div>
          <Text className="font-medium text-zinc-700">{name}</Text>
          <Text className="text-sm text-zinc-400">{email}</Text>
        </div>
      </div>
      <MemberDropdown role={role} />
    </div>
  )
}


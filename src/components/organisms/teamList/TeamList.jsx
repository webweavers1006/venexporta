import { MemberItem } from "@components/molecules/MemberItem"

export function TeamList({ members }) {
  return (
    <div className="space-y-1">
      {members.map((member) => (
        <MemberItem
          key={member.email}
          name={member.name}
          email={member.email}
          avatarSrc={member.avatarSrc}
          role={member.role}
        />
      ))}
    </div>
  )
}


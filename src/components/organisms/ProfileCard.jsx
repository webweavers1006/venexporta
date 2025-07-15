import { ProfileHeader } from "@components/molecules/ProfileHeader";
import { InfoSection } from "@components/molecules/InfoSection";

const ProfileCard = ({ profile, contact }) => {
  return (
    <div className="box">
      <div className="space-y-8">
        <ProfileHeader
          name={profile.empresa}
          isPro={'Actividad Empresarial: ' +profile.tipo_actividad_empresarial}
          isModerator={'Tipo Propiedad: ' +profile.tipo_propiedad}
          avatarUrl={'https://www.w3schools.com/howto/img_avatar.png'}
        />

        <InfoSection title="Dirección">
        {profile.estado + ' - ' + profile.municipio +' - '+ profile.parroquia}
        <div>{profile.direccion}</div>
        </InfoSection>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <InfoSection title="RIF">{profile.rif}</InfoSection>

            <InfoSection title="Plantilla">{profile.jobTitle}</InfoSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
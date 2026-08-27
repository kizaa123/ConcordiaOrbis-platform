"use client";

import Image from "next/image";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  img: string;
};

export function TeamFlipCard({ member }: { member: TeamMember }) {
  return (
    <article className="team-flip" aria-label={`${member.name}, ${member.role}`}>
      <div className="team-flip-inner">
        <div className="team-flip-face team-flip-front">
          <div className="team-flip-photo">
            <Image
              src={member.img}
              alt={member.name}
              fill
              className="object-contain object-center p-1"
              sizes="(max-width: 640px) 70vw, 210px"
            />
          </div>
          <h2 className="team-flip-name">{member.name}</h2>
          <p className="team-flip-role">{member.role}</p>
        </div>

        <div className="team-flip-face team-flip-back">
          <div className="team-flip-fields">
            <p>
              <strong>Name:</strong> {member.name}
            </p>
            <p>
              <strong>Role:</strong> {member.role}
            </p>
            <p>
              <strong>Qualifications:</strong>
              <span>{member.bio}</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

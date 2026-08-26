import { Link } from 'react-router-dom';
import Tag from './Tag';
import RatingStars from './RatingStars';

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`} className="card group flex flex-col p-5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 text-base font-semibold text-fg group-hover:text-accent">
          {project.title}
        </h3>
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
          ♥ {project.likesCount}
        </span>
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-muted">{project.description}</p>

      {project.tags?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted">by {project.ownerName}</span>
        <div className="flex items-center gap-1.5">
          <RatingStars value={Math.round(project.avgRating || 0)} readOnly size="text-xs" />
          <span className="text-xs text-muted">({project.ratingsCount || 0})</span>
        </div>
      </div>
    </Link>
  );
}

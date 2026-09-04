import { ESTADO_LABEL } from "../utils/format";

export default function StatusBadge({ estado }) {
  return <span className={`status-badge status-${estado}`}>{ESTADO_LABEL[estado] || estado}</span>;
}

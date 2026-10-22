import { Link } from "react-router";
import { StatusMessage } from "../components/LoadingState.jsx";

function NotFoundPage() {
  return (
    <div className="catalog catalog--page container">
      <StatusMessage
        title="Cette page n'existe pas"
        action={
          <Link to="/" className="btn btn--primary">
            Revenir à l'accueil
          </Link>
        }
      >
        L'adresse saisie ne correspond à aucune page de JFLIX.
      </StatusMessage>
    </div>
  );
}

export default NotFoundPage;

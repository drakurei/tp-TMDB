function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="footer__tmdb">
          Données fournies par The Movie Database (TMDB)
        </a>
        <p>
          JFLIX est un projet pédagogique réalisé en React. Les films, affiches et résumés proviennent de
          TMDB. Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

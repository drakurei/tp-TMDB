function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pages de résultats">
      <button type="button" className="btn btn--ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Précédent
      </button>
      <p className="pagination__info" aria-live="polite">
        Page {page} sur {totalPages.toLocaleString("fr-FR")}
      </p>
      <button
        type="button"
        className="btn btn--ghost"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Suivant
      </button>
    </nav>
  );
}

export default Pagination;

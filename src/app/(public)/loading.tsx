export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-border border-t-nerta-blue" />
        <p className="font-body text-sm text-muted-text">Carregando…</p>
      </div>
    </div>
  );
}

export default function CV() {
  return (
    <div className="fixed inset-0 w-screen h-screen">
      <iframe
        src="/srajan-cv.pdf"
        className="w-full h-full"
        style={{ border: "none" }}
        title="Srajan CV"
      />
    </div>
  );
}

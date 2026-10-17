import Icon from "./Icon";

function layMaYouTube(url) {
  if (!url) return null;

  const mau = [
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
  ];

  for (const m of mau) {
    const kq = url.match(m);
    if (kq) return kq[1];
  }
  return null;
}

function TrinhPhatVideo({ url }) {
  const ma = layMaYouTube(url);

  if (ma) {
    return (
      <div className="player">
        <iframe
          src={`https://www.youtube.com/embed/${ma}`}
          title="Video bài học"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // File video trực tiếp (.mp4, .webm…)
  if (url && /\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return (
      <div className="player">
        <video src={url} controls />
      </div>
    );
  }

  return (
    <div className="player">
      <div className="player-fallback">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-lg"
          >
            <Icon ten="moNgoai" size={18} /> Mở video
          </a>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            Bài học này chưa có video
          </span>
        )}
      </div>
    </div>
  );
}

export default TrinhPhatVideo;

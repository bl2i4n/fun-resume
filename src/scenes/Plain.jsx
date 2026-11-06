/** The RUN escape hatch: a plain, printable resume. */
export default function Plain({ resume: r, onBack }) {
  const links = r.items.filter((it) => !String(it.href).startsWith('TODO') && it.action !== 'mailto')
  return (
    <div className="plain">
      <div className="page">
        <a href="#" className="back" onClick={(e) => { e.preventDefault(); onBack() }}>◀ BACK TO THE GAME</a>
        <h1>{r.name}</h1>
        <p className="sub">{r.title} · {r.location}</p>
        <p className="links">
          <a href={`mailto:${r.email}`}>{r.email}</a>
          {links.map((it) => <a key={it.name} href={it.href} target="_blank" rel="noopener">{it.name.toLowerCase()}</a>)}
        </p>

        <h2>Experience</h2>
        {r.experience.map((e) => (
          <div key={e.company}>
            <h3>{e.role}, {e.company}</h3>
            <p className="sub">{e.year}</p>
            <ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
          </div>
        ))}

        <h2>Skills</h2>
        <ul>{r.skills.map((s) => <li key={s.move}>{s.text}</li>)}</ul>

        <h2>Education</h2>
        {r.education.map((e) => (
          <div key={e.move}><h3>{e.school}</h3><p className="sub">{e.degree}, {e.year}</p></div>
        ))}

        <h2>Certifications</h2>
        <ul>{r.certifications.map((c) => <li key={c.move}>{c.name}, {c.issuer} ({c.year})</li>)}</ul>

        <h2>Projects</h2>
        <ul>{r.projects.map((p) => <li key={p.move}>{p.text}</li>)}</ul>
      </div>
    </div>
  )
}

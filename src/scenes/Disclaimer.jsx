/** Fan-project disclaimer, reachable at #/disclaimer and from the footer. */
export default function Disclaimer({ name, onBack }) {
  return (
    <div className="plain">
      <div className="page">
        <a href="#/" className="back" onClick={(e) => { e.preventDefault(); onBack() }}>◀ BACK TO THE GAME</a>
        <h1>Disclaimer</h1>

        <p>
          This site is an interactive resume for {name}, built as a free, non-commercial fan project.
          It is a parody inspired by the look and feel of classic handheld monster-catching games.
          Nothing here is for sale, and the site runs no ads.
        </p>

        <h2>Not affiliated</h2>
        <p>
          This site is not affiliated with, endorsed by, sponsored by or approved by Nintendo, The Pokémon Company,
          Creatures Inc. or GAME FREAK inc.
        </p>

        <h2>Trademarks and copyrights</h2>
        <p>
          Pokémon and related names are trademarks of Nintendo, Creatures Inc., GAME FREAK inc. and The Pokémon Company.
          They are used here only to describe the parody, and all rights to them belong to their respective owners.
        </p>

        <h2>Original work</h2>
        <p>
          The characters, pixel art, sound effects, writing and code on this site are original and were made for this site.
          The resume content belongs to {name}.
        </p>

        <h2>Contact</h2>
        <p>
          If you are a rights holder and have a concern about anything on this site, please get in touch through the
          contact links on the resume and it will be addressed promptly.
        </p>
      </div>
    </div>
  )
}

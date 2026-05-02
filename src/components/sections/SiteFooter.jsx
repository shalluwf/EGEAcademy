export function SiteFooter({ navTitle, navLinks, contacts }) {
  return (
    <footer className="site-footer" id="footer">
      <div className="container site-footer__inner">
        <div className="site-footer__col">
          <p className="site-footer__heading">{navTitle}</p>
          {navLinks.map((item) => (
            <a key={item.href} className="site-footer__link" href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="site-footer__col site-footer__col--contacts">
          {contacts.map((item) => (
            <a
              key={item.href}
              className="site-footer__link"
              href={item.href}
              {...(item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

import { Header } from './components/header/Header.jsx'
import { Hero } from './components/hero/Hero.jsx'
import { FreeLesson } from './components/sections/FreeLesson.jsx'
import { Teachers } from './components/sections/Teachers.jsx'
import { Reviews } from './components/sections/Reviews.jsx'
import { WhyTrust } from './components/sections/WhyTrust.jsx'
import { Faq } from './components/sections/Faq.jsx'
import { LeadForm } from './components/sections/LeadForm.jsx'
import { SiteFooter } from './components/sections/SiteFooter.jsx'
import { homepageContent } from './content/homepage.js'
import { SubjectSelectionProvider } from './state/subjectSelection.jsx'

export default function App() {
  const c = homepageContent

  return (
    <SubjectSelectionProvider>
      <div className="page">
        <a href="#content" className="sr-only">
          Перейти к содержимому
        </a>

        <Header brandTitle={c.header.brandTitle} brandSubtitle={c.header.brandSubtitle} />

        <main id="content">
          <Hero
            kicker={c.hero.kicker}
            title={c.hero.title}
            primaryCta={c.hero.primaryCta}
            stats={c.hero.stats}
          />

          <FreeLesson title={c.freeLesson.title} lines={c.freeLesson.lines} ctaLabel={c.freeLesson.ctaLabel} />

          <Teachers title={c.teachers.title} subjects={c.teachers.subjects} featured={c.teachers.featured} />

          <Reviews title={c.reviews.title} items={c.reviews.items} />

          <WhyTrust title={c.whyTrust.title} points={c.whyTrust.points} />

          <Faq title={c.faq.title} items={c.faq.items} />

          <LeadForm
            title={c.leadForm.title}
            description={c.leadForm.description}
            fields={c.leadForm.fields}
            subjectOptions={c.subjectOptions}
            consent={c.leadForm.consent}
            submitLabel={c.leadForm.submitLabel}
          />
        </main>

        <SiteFooter navTitle={c.footer.navTitle} navLinks={c.footer.navLinks} contacts={c.footer.contacts} />
      </div>
    </SubjectSelectionProvider>
  )
}

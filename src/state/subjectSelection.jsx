import { createContext, useContext, useMemo, useState } from 'react'

const SubjectSelectionContext = createContext(null)

export function SubjectSelectionProvider({ children }) {
  const [exam, setExam] = useState('ЕГЭ')
  const [subject, setSubject] = useState('Обществознание')

  const value = useMemo(
    () => ({ exam, setExam, subject, setSubject }),
    [exam, subject]
  )

  return (
    <SubjectSelectionContext.Provider value={value}>
      {children}
    </SubjectSelectionContext.Provider>
  )
}

export function useSubjectSelection() {
  const ctx = useContext(SubjectSelectionContext)
  if (!ctx) {
    throw new Error('useSubjectSelection must be used within SubjectSelectionProvider')
  }
  return ctx
}


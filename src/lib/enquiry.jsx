import { createContext, useCallback, useContext, useState } from 'react'

const EnquiryCtx = createContext(null)

/**
 * Shared enquiry state so any CTA on the page can open the consultation
 * drawer pre-set to the right enquiry type (and optional subject, e.g. a grass).
 */
export function EnquiryProvider({ children }) {
  const [state, setState] = useState({ open: false, type: 'expert', subject: '' })

  const openEnquiry = useCallback((type = 'expert', subject = '') => {
    setState({ open: true, type, subject })
  }, [])
  const closeEnquiry = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  return <EnquiryCtx.Provider value={{ ...state, openEnquiry, closeEnquiry }}>{children}</EnquiryCtx.Provider>
}

export const useEnquiry = () => useContext(EnquiryCtx)

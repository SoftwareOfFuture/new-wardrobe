/**
 * Oda Planlayıcı için özel layout.
 * Storefront layout'undan miras alınan Footer'ı gizler,
 * bunun yerine sade bir "Ürünlere Dön" çubuğu gösterir.
 *
 * Not: Next.js'te nested layout parent'ın <main> içine render eder.
 * Footer parent layoutta olduğu için burada üzerine yazamayız,
 * bu yüzden storefront layout.tsx'teki footer'ı usePathname ile
 * client tarafında gizleyen bir wrapper kullanıyoruz.
 */
export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

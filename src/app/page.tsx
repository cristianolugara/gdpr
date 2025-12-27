import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, FileText, Users, Lock, Zap, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link className="flex items-center gap-2 font-bold text-xl tracking-tight" href="/">
            <div className="rounded-lg bg-blue-600 p-1.5">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span>FastGDPR</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#features">
              Funzionalità
            </Link>
            <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/dashboard">
              Dashboard
            </Link>
          </nav>
          <div className="ml-6 flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Accedi</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">Inizia Ora</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white dark:from-blue-950/30 dark:via-slate-950 dark:to-slate-950"></div>
          <div className="container mx-auto flex max-w-5xl flex-col items-center gap-6 text-center px-4">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Nuovo aggiornamento: AI Assistant v2.0
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 pb-2">
              Conformità GDPR Semplice e Veloce <br className="hidden sm:inline" />
              <span className="text-blue-600">Potenziata dall'Intelligenza Artificiale</span>
            </h1>

            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300 md:text-xl leading-relaxed">
              Dimentica la burocrazia complessa. Genera registri, lettere di nomina, contratti DPA e valutazioni in pochi minuti.
              La soluzione completa per DPO, aziende e consulenti privacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all hover:scale-105">
                  Provalo Gratuitamente
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-12 px-8 text-base bg-white/50 backdrop-blur-sm hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800">
                  Come Funziona
                </Button>
              </Link>
            </div>

            {/* DASHBOARD PREVIEW MOCKUP */}
            <div className="mt-16 relative w-full max-w-5xl rounded-xl border bg-white/50 p-2 shadow-2xl backdrop-blur-sm dark:bg-slate-900/50 dark:border-slate-800 ring-1 ring-slate-900/10 lg:rounded-2xl lg:p-4">
              <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 aspect-[16/9] relative group">
                {/* Simulated Dashboard UI - Simplified CSS representation */}
                <div className="absolute inset-0 flex">
                  <div className="w-64 border-r bg-white dark:bg-slate-900 hidden md:block p-4 space-y-4">
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-8 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500"></div>
                      <div className="h-8 bg-transparent rounded"></div>
                      <div className="h-8 bg-transparent rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 p-8 bg-slate-50/50 dark:bg-slate-950">
                    <div className="flex justify-between items-center mb-8">
                      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-10 w-32 bg-blue-600 rounded shadow-lg shadow-blue-600/20"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="h-32 bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-sm"></div>
                      <div className="h-32 bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-sm"></div>
                      <div className="h-32 bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-sm"></div>
                    </div>
                    <div className="mt-6 h-64 bg-white dark:bg-slate-900 rounded-xl border shadow-sm"></div>
                  </div>
                </div>

                {/* Overlay text */}
                <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-black/5 transition-colors">
                  <span className="sr-only">Dashboard Preview</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Funzionalità Chiave
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Tutto ciò che serve per l'adeguamento</h2>
              <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed dark:text-slate-400">
                Una suite completa di strumenti integrati per gestire ogni aspetto della privacy aziendale, dalla formazione alla gestione dei data breach.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col p-6 space-y-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950 hover:shadow-lg transition-shadow border-slate-100 dark:border-slate-800">
                <div className="p-3 w-fit rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Generazione Documenti</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Crea istantaneamente Lettere di Incarico, DPA per fornitori, Registri del Trattamento e Informative grazie ai nostri template intelligenti.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col p-6 space-y-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950 hover:shadow-lg transition-shadow border-slate-100 dark:border-slate-800">
                <div className="p-3 w-fit rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Gestione Staff & Fornitori</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tieni traccia di nomine, NDA firmati e valuta l'adeguatezza dei fornitori esterni con checklist di sicurezza integrate (Doc 21/22).
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col p-6 space-y-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950 hover:shadow-lg transition-shadow border-slate-100 dark:border-slate-800">
                <div className="p-3 w-fit rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Data Breach & Incidenti</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Wizard guidato per la gestione delle violazioni. Valutazione del rischio R.I.D. e calcolo automatico delle scadenze di notifica al Garante.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col p-6 space-y-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950 hover:shadow-lg transition-shadow border-slate-100 dark:border-slate-800">
                <div className="p-3 w-fit rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">AI Assistant</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Il tuo consulente virtuale sempre disponibile. Chiedi supporto normativo, generazioni di clausole o analisi dei rischi in tempo reale.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="flex flex-col p-6 space-y-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950 hover:shadow-lg transition-shadow border-slate-100 dark:border-slate-800">
                <div className="p-3 w-fit rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">DPIA Automatizzata</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Valutazione d'Impatto guidata. Identifica i rischi elevati (profilazione, larga scala) e definisci le misure di mitigazione con facilità.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="flex flex-col p-6 space-y-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950 hover:shadow-lg transition-shadow border-slate-100 dark:border-slate-800">
                <div className="p-3 w-fit rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Audit & Controlli</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pianifica audit periodici di sicurezza e backup. Mantieni lo storico dei controlli per dimostrare l'accountability aziendale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Perché scegliere FastGDPR?
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                  Non siamo solo un software, ma un metodo di lavoro strutturato per garantire la serenità della tua azienda.
                </p>

                <ul className="space-y-4">
                  {["Conforme al Regolamento UE 2016/679", "Risparmio del 70% del tempo di gestione", "Documentazione sempre aggiornata e pronta all'uso", "Supporto multi-aziendale per consulenti"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link href="/signup">
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                      Inizia la Prova
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Visual Decorative Element */}
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl text-white overflow-hidden min-h-[400px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>

                <blockquote className="relative z-10 space-y-6">
                  <div className="text-2xl font-medium italic leading-relaxed">
                    "Finalmente uno strumento che rende la privacy comprensibile e gestibile. La generazione automatica dei DPA ci ha fatto risparmiare ore di lavoro legale."
                  </div>
                  <footer className="flex items-center gap-4 pt-4 border-t border-white/20">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold text-lg">
                      MC
                    </div>
                    <div>
                      <div className="font-bold">Marco C.</div>
                      <div className="text-blue-100 text-sm">DPO & IT Manager</div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Pronto a mettere al sicuro i tuoi dati?</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10">
              Unisciti alle aziende che hanno già scelto la semplicità. Crea il tuo account gratuito e accedi alla dashboard completa in meno di 2 minuti.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30">
                Crea Account Gratuito
              </Button>
            </Link>
            <p className="mt-4 text-sm text-slate-400">Nessuna carta di credito richiesta per iniziare.</p>
          </div>
        </section>
      </main>

      <footer className="border-t bg-slate-50 dark:bg-slate-950 py-12 text-slate-500 text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-5 w-5" />
            FastGDPR
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Termini di Servizio</Link>
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contatti</Link>
          </div>
          <div className="text-center md:text-right">
            &copy; {new Date().getFullYear()} Antigravity. Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    </div>
  );
}

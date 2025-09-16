function ImpressumPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 mt-10 text-center">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Impressum & AGB
          </h1>
        </header>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-medium">Verantwortlich: </h1>
            <address className="not-italic mt-4 space-y-1 text-gray-800">
              <p className="font-medium">Michael Hovekamp</p>
              <p>Hovekampsweg 15</p>
              <p>48485 Neuenkrichen</p>
            </address>

            <div className="mt-6">
              <h1 className="text-base font-medium">Kontakt:</h1>
              <dl className="mt-3 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <dt className="text-sm text-gray-500 sm:w-36">Email:</dt>
                  <dd>michael@hovekamp.eu</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <dt className="text-sm text-gray-500 sm:w-36">Telefon</dt>
                  <dd>+49 01590 1212377</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <dt className="text-sm text-gray-500 sm:w-36">
                    Umsatzsteuer-ID:
                  </dt>
                  <dd className="text-gray-800">DE317006878</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
            <h2 className="text-xl font-medium">Unternehmen</h2>
            <p className="mt-3 text-gray-800">
              „Hovekamp Turmdrehkrane“ — Inhaber: Michael Hovekamp.
            </p>
            <p className="mt-3 text-sm text-blue-900/80">
              Hinweis: Diese Seite enthält rechtlich relevante Informationen.
              Bei Fragen zu den AGB wenden Sie sich bitte an die oben genannten
              Kontaktdaten.
            </p>
          </div>
        </section>

        <h1 className="text-2xl font-semibold mt-10">
          Allgemeine Geschäftsbedingungen (AGB) für das Unternehmen „Hovekamp
          Turmdrehkrane“ Inhaber Michael Hovekamp
        </h1>

        <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-left">
          <div className="prose prose-sm sm:prose-base max-w-none">
            <h3>1. Geltungsbereich</h3>
            <p>
              Diese Allgemeinen Geschäftsbedingungen gelten für sämtliche
              Geschäftsbeziehungen zwischen dem Unternehmen "Hovekamp
              Turmdrehkrane" Inhaber Michael Hovekamp (nachfolgend
              "Auftragnehmer" genannt) und seinen Kunden (nachfolgend
              "Auftraggeber" genannt). Wir handeln ausschließlich nach unseren
              AGB’s.
            </p>
            <h3 className="mt-4">2. Vertragsabschluss</h3>
            <p>
              2.1 Angebote des Auftragnehmers sind freibleibend und
              unverbindlich, sofern sie nicht ausdrücklich als verbindlich
              bezeichnet sind.
            </p>
            <p>
              2.2 Der Vertrag kommt durch die schriftliche Auftragsbestätigung
              des Auftragnehmers oder durch die tatsächliche Ausführung der
              Leistung zustande.
            </p>
            <h3 className="mt-4">3. Leistungsumfang</h3>
            <p>
              3.1 Der Auftragnehmer erbringt Dienstleistungen im Bereich
              Turmdrehkrane gemäß dieser AGB und ggf. weiterer individuell
              vereinbarten Vertragsbedingungen.
            </p>
            <p>
              3.2 Änderungen des Leistungsumfangs bedürfen der schriftlichen
              Vereinbarung.
            </p>
            <h3 className="mt-4">4. Preise, Zahlungsbedingungen und Verzug</h3>
            <p>
              4.1 Die Preise ergeben sich aus dem individuell vereinbarten
              Angebot des Auftragnehmers.
            </p>
            <p>
              4.2 Alle Preise verstehen sich zuzüglich der gesetzlichen
              Mehrwertsteuer.
            </p>
            <p>
              4.3 Die Zahlung der vereinbarten Vergütung ist sofort nach
              Rechnungsstellung ohne Abzug fällig.
            </p>
            <p>
              4.4 Als Verzug gilt, wenn der Auftraggeber nicht innerhalb von
              fünf Tagen nach Rechnungsstellung zahlt.
            </p>
            <h3 className="mt-4">5. Haftung</h3>
            <p>
              Der Auftragnehmer haftet nur für Vorsatz und grobe Fahrlässigkeit.
              Die Haftung ist auf den vertragstypischen Schaden begrenzt. Eine
              Haftung für entgangenen Gewinn oder mittelbare Schäden ist
              ausgeschlossen.
            </p>
            <h3 className="mt-4">6. Stornierung</h3>
            <p>
              Bei Stornierung von vereinbarten Leistungen durch den Auftraggeber
              werden Stornogebühren in Höhe von 50% der vereinbarten Vergütung
              fällig, sofern die Stornierung nicht mindestens 14 Tage vor dem
              vereinbarten Leistungszeitpunkt schriftlich erfolgt.
            </p>
            <h3 className="mt-4">7. Geheimhaltung</h3>
            <p>
              Beide Vertragsparteien verpflichten sich zur Geheimhaltung aller
              ihnen im Rahmen der Vertragsdurchführung bekannt gewordenen
              geschäftlichen Angelegenheiten des jeweils anderen
              Vertragspartners.
            </p>
            <h3 className="mt-4">8. Eigentumsvorbehalt</h3>
            <p>
              8.1 Gelieferte Waren und Maschinen bleiben bis zur vollständigen
              Zahlung im Eigentum des Auftragnehmers.
            </p>
            <p>
              8.2 Der Auftraggeber ist verpflichtet, die unter
              Eigentumsvorbehalt stehenden Waren und Maschinen pfleglich zu
              behandeln und vor Verlust, Beschädigung oder Zugriff Dritter zu
              schützen.
            </p>
            <p>
              8.3 Bei vertragswidrigem Verhalten des Auftraggebers, insbesondere
              bei Zahlungsverzug, ist der Auftragnehmer berechtigt, die unter
              Eigentumsvorbehalt stehenden Waren und Maschinen zurückzunehmen.
              Die Geltendmachung des Eigentumsvorbehalts gilt nicht als
              Rücktritt vom Vertrag.
            </p>
            <h3 className="mt-4">
              9. Haftungsausschluss bei Schäden an Zuwegungen zur Baustelle und
              weiteres
            </h3>
            <p>
              9.1 Der Auftragnehmer übernimmt keine Haftung für Schäden an
              Zuwegungen zur Baustelle und auf der Baustelle, sofern diese nicht
              auf grobe Fahrlässigkeit oder Vorsatz des Auftragnehmers
              zurückzuführen sind.
            </p>
            <p>
              9.2 Der Auftraggeber ist verpflichtet, sicherzustellen, dass die
              Zuwegungen zur Baustelle sowie die Baustelle selbst in einem
              Zustand sind, der die ordnungsgemäße Durchführung der vereinbarten
              Leistungen ermöglicht.
            </p>
            <p>
              9.3 Der Auftraggeber verpflichtet sich, den Auftragnehmer umgehend
              über etwaige Schäden an Zuwegungen oder der Baustelle zu
              informieren, sofern diese im Zusammenhang mit den erbrachten
              Leistungen stehen.
            </p>
            <p>
              9.4 Bei der Nutzung von Zuwegungen über Grundstücke Dritter ist
              der Auftraggeber allein für sämtliche Haftungsansprüche
              verantwortlich, die sich aus dieser Nutzung ergeben könnten.
            </p>
            <p>
              9.5 Der Auftraggeber verpflichtet sich, sicherzustellen, dass die
              Zuwegungen über Dritter-Gundstücke ordnungsgemäß genutzt werden
              und keine Schäden oder Beeinträchtigungen für die Eigentümer
              dieser Grundstücke entstehen.
            </p>
            <p>
              9.6 Etwaige Kosten, Schadensersatzforderungen oder andere
              Ansprüche von Grundstückseigentümern, die sich aus der Nutzung der
              Zuwegungen über Dritter-Gundstücke ergeben, trägt der
              Auftraggeber.
            </p>
            <p>
              9.7 Der Auftragnehmer ist von jeglicher Haftung für Schäden oder
              Ansprüche im Zusammenhang mit der Zuwegung über Grundstücke
              Dritter freigestellt.
            </p>
            <p>
              9.8 Der Auftraggeber ist verpflichtet, eine ausreichende
              Versicherung für die Baustelle sowie die Zuwegungen abzuschließen,
              um mögliche Schäden abzudecken.
            </p>
            <h3 className="mt-4">
              10. Kranstandort und Genauigkeit der Kranmontage
            </h3>
            <p>
              10.1 Der Auftraggeber ist für die ausreichende Festigkeit des
              Kranstandortes verantwortlich und weist den Auftragnehmer vor
              Beginn der Arbeiten auf den genauen Kranstandort hin.
            </p>
            <p>
              10.2 Der Auftraggeber trägt die Verantwortung dafür, dass der
              Kranstandort den echnischen Anforderungen entspricht, um die
              sichere Aufstellung und Nutzung der Turmdrehkrane zu
              gewährleisten.
            </p>
            <p>
              10.3 Nachträgliche Änderungen des Kranstandortes, die nicht im
              ursprünglichen Auftrag des Auftragnehmers enthalten waren, gehen
              zu Lasten des Auftraggebers.
            </p>
            <p>
              10.4 Die Genauigkeit bei der Kranmontage beträgt maximal 1,5 Meter
              Abwei chung vom vorab festgelegten Kranstandort.
            </p>
            <p>
              10.5 Der Auftragnehmer strebt an, die Montage gemäß den
              technischen Spezifikationen und den getroffenen Vereinbarungen
              durchzuführen.
            </p>
            <p>
              10.6 Sollte die tatsächliche Genauigkeit die vereinbarten 1,5
              Meter überschreiten, hat der Auftraggeber das Recht, den
              Auftragnehmer unverzüglich zu informieren, um notwendige
              Anpassungen vorzunehmen.
            </p>
            <h3 className="mt-4">11. Mietmaschinen</h3>
            <p>
              11.1 Der Auftraggeber hat das Recht, vom Auftragnehmer Maschinen
              zu mieten, sofern dies im Rahmen der vertraglichen Vereinbarungen
              vorgesehen ist.
            </p>
            <p>
              11.2 Der Auftraggeber bzw. der Kranmieter haftet für alle Schäden
              an der gemieteten Maschine, die nicht auf grobe Fahrlässigkeit
              oder Vorsatz des Auftragnehmers zurückzuführen sind.
            </p>
            <p>
              11.3 Der Auftraggeber verpflichtet sich, die gemieteten Maschinen
              pfleglich zu behandeln und sämtliche Sicherheitsvorschriften und
              Bedienungsanleitungen des Herstellers zu beachten.
            </p>
            <p>
              11.4 Die Miete der Maschine wird in der Regel Wochenweise
              berechnet und einmal pro Monat berechnet. Es werden immer volle
              Wochen abgerechnet.
            </p>
            <h3 className="mt-4">12. Zahlungsverzug bei Mietmaschinen</h3>
            <p>
              12.1 Die Miete für die gemieteten Maschinen ist spätestens bis zum
              vereinbarten Fälligkeitsdatum zu entrichten.
            </p>
            <p>
              12.2 Bei Zahlungsverzug des Auftraggebers bzw. des Kranmieters
              gerät dieser automatisch in Verzug, ohne dass es einer Mahnung
              bedarf.
            </p>
            <p>
              12.3 Im Falle des Zahlungsverzugs ist der Auftragnehmer
              berechtigt, die Miete für die gesamte vereinbarte Mietdauer bis
              zur vollständigen Zahlung in Rechnung zu stellen.
            </p>
            <p>
              12.4 Bei Zahlungsverzug des Auftraggebers bzw. des Kranmieters ist
              der Auftragnehmer berechtigt, den Mietvertrag fristlos zu
              kündigen.
            </p>
            <p>
              12.5 Die Geltendmachung weitergehender Schadensersatzansprüche
              bleibt dem Auftragnehmer vorbehalten.
            </p>
            <h3 className="mt-4">
              13. Haftung bei Diebstahl von Mietmaschinen und Mietsachen
            </h3>
            <p>
              13.1 Der Auftraggeber haftet nicht nur für den Diebstahl der
              gesamten gemieteten Maschine, sondern auch für den Diebstahl von
              Teilen der Maschine, sofern dieser nicht auf grobe Fahrlässigkeit
              oder Vorsatz des Auftragnehmers zurückzuführen ist.
            </p>
            <p>
              13.2 Der Auftraggeber bzw. der Kranmieter trägt das Risiko des
              Diebstahls von Teilen der Maschine und ist verpflichtet, alle
              erforderlichen Maßnahmen zur Sicherung der gemieteten Maschine und
              ihrer Bestandteile zu treffen.
            </p>
            <p>
              13.3 Im Falle eines Diebstahls von Teilen der Maschine hat der
              Auftraggeber bzw. der Kranmieter den Vorfall unverzüglich dem
              Auftragnehmer zu melden.
            </p>
            <p>
              13.4 Bei Diebstahl von Teilen der Maschine bleibt die Miete für
              die gesamte gemietete Maschine weiterhin fällig, bis zur Klärung
              der Haftungsfrage und bis zur Erstattung möglicher Schäden durch
              den Auftraggeber bzw. den Kranmieter.
            </p>
            <h3 className="mt-4">14. Unmöglichkeit des Abbaus</h3>
            <p>
              14.1 Sollte aus Gründen, die nicht dem Auftragnehmer zuzurechnen
              sind, der Abbau der gemieteten Maschine nicht möglich sein, so
              trägt der Auftraggeber sämtliche Zusatzkosten, die dem
              Auftragnehmer durch die Verzögerung oder Unmöglichkeit des Abbaus
              entstehen.
            </p>
            <p>
              14.2 Während der Zeit, in der der Abbau aufgrund von Umständen,
              die dem Auftraggeber zuzurechnen sind, nicht durchgeführt werden
              kann, bleibt die Miete weiterhin fällig.
            </p>
            <p>
              14.3 Die Zusatzkosten und die weiterhin fällige Miete sind vom
              Auftraggeber unverzüglich nach Mitteilung durch den Auftragnehmer
              zu begleichen.
            </p>
            <h3 className="mt-4">
              15. Haftungsausschluss für Folgekosten und Kosten Dritter durch
              höhere Gewalt, eine defekte Maschine oder Weiteres
            </h3>
            <p>
              15.1 Der Auftragnehmer haftet nicht für Folgekosten oder Kosten
              Dritter, die durch höhere Gewalt, eine defekte Maschine oder
              andere unvorhersehbare Umstände entstehen.
            </p>
            <p>
              15.2 Als höhere Gewalt gelten Naturkatastrophen, Kriege, Streiks,
              behördliche Anordnungen und sonstige Ereignisse, die außerhalb der
              Kontrolle des Auftragnehmers liegen.
            </p>
            <p>
              15.3 Der Auftraggeber ist verpflichtet, unverzüglich über
              Ereignisse höherer Gewalt oder eine defekte Maschine, die den
              Vertragsgegenstand betreffen, den Auftragnehmer zu informieren.
            </p>
            <h3 className="mt-4">16. Weiteres</h3>
            <p>
              16.1 Der Auftragnehmer behält sich das Recht vor, im Rahmen der
              vertraglichen Vereinbarungen Unterbeauftragte einzusetzen.
            </p>
            <p>
              16.2 Alle Rechte an geistigem Eigentum, die im Rahmen der
              Vertragsdurchführung entstehen, verbleiben beim Auftragnehmer.
            </p>
            <p>
              16.3 Der Auftragnehmer ist berechtigt, die erbrachten Leistungen
              zu dokumentieren und für Referenzzwecke zu verwenden.
            </p>
            <h3 className="mt-4">17. Salvatorische Klausel</h3>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam oder
              undurchführbar sein oder werden, so wird die Wirksamkeit der
              übrigen Bestimmungen hiervon nicht berührt. Die Vertragsparteien
              verpflichten sich, anstelle der unwirksamen oder undurchführbaren
              Bestimmung eine solche wirksame und durchführbare Regelung zu
              treffen, die dem wirtschaftlichen Zweck der unwirksamen oder
              undurchführbaren Bestimmung am nächsten kommt.
            </p>
            <h3 className="mt-4">18. Schlussbestimmungen</h3>
            <p>
              18.1 Änderungen und Ergänzungen dieser AGB bedürfen der
              Schriftform.
            </p>
            <p>18.2 Es gilt das Recht der Bundesrepublik Deutschland.</p>
            <p>
              18.3 Erfüllungsort und Gerichtsstand für alle Streitigkeiten aus
              diesem Vertragsverhältnis ist der Sitz des Auftragnehmers, sofern
              der Auftraggeber Vollkaufmann ist.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ImpressumPage;

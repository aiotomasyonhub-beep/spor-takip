import { KURALLAR, type KuralBolumu } from '../data/rules';
import { Modal } from './Modal';

const VURGU: Record<NonNullable<KuralBolumu['vurgu']>, string> = {
  tehlike: 'border-danger/60 bg-danger/10 [&_h3]:text-danger',
  uyari: 'border-warn/60 bg-warn/10 [&_h3]:text-warn',
  bilgi: 'border-line bg-surface-2',
};

export function RulesModal({ acik, onKapat }: { acik: boolean; onKapat: () => void }) {
  return (
    <Modal acik={acik} onKapat={onKapat} baslik="Kurallar">
      <div className="space-y-3">
        {KURALLAR.map((b) => (
          <section key={b.baslik} className={`rounded-xl border p-4 ${VURGU[b.vurgu ?? 'bilgi']}`}>
            <h3 className="mb-2 font-bold">{b.baslik}</h3>
            <ul className="list-disc space-y-1.5 pl-5 leading-snug">
              {b.maddeler.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}

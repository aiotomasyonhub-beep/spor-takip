import { useEffect, useState } from 'react';
import { sayiOku } from '../lib/format';
import type { SetKaydi } from '../types';
import { IkonTik } from './icons';

interface Props {
  no: number;
  set: SetKaydi;
  onceki?: SetKaydi;
  agirliksiz: boolean;
  birimKisa: string;
  onDegis: (degisiklik: Partial<SetKaydi>) => void;
  onTamamla: (tamamlandi: boolean) => void;
}

/** Yazarken "12," gibi ara değerler kaybolmasın diye metni yerel tutar, sayıyı üst bileşene iletir. */
function SayiGirisi({
  deger,
  placeholder,
  ondalik,
  etiket,
  onDegis,
}: {
  deger: number | null;
  placeholder: string;
  ondalik: boolean;
  etiket: string;
  onDegis: (n: number | null) => void;
}) {
  const [metin, setMetin] = useState(deger == null ? '' : String(deger).replace('.', ','));

  // Dışarıdan değişirse (ör. tik ile önceki değerden doldurma) metni eşitle
  useEffect(() => {
    if (sayiOku(metin) !== deger) setMetin(deger == null ? '' : String(deger).replace('.', ','));
  }, [deger]); // metin bilerek bağımlılık değil: yalnızca dış değişikliklere tepki verir

  return (
    <input
      type="text"
      inputMode={ondalik ? 'decimal' : 'numeric'}
      pattern={ondalik ? '[0-9]*[.,]?[0-9]*' : '[0-9]*'}
      enterKeyHint="next"
      autoComplete="off"
      aria-label={etiket}
      placeholder={placeholder}
      value={metin}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => {
        const v = e.target.value.replace(ondalik ? /[^0-9.,]/g : /[^0-9]/g, '');
        setMetin(v);
        onDegis(sayiOku(v));
      }}
      className="tabular h-14 w-full min-w-0 rounded-xl border border-line bg-bg text-center text-2xl font-bold placeholder:font-normal placeholder:text-muted/60 focus:border-accent focus:outline-none"
    />
  );
}

export function SetRow({ no, set, onceki, agirliksiz, birimKisa, onDegis, onTamamla }: Props) {
  const fmt = (n: number | null | undefined) => (n == null ? '–' : String(n).replace('.', ','));

  return (
    <div
      className={`grid items-center gap-2 rounded-xl p-1 ${agirliksiz ? 'grid-cols-[2.25rem_1fr_3.5rem]' : 'grid-cols-[2.25rem_1fr_1fr_3.5rem]'} ${
        set.tamamlandi ? 'bg-accent/10' : ''
      }`}
    >
      <div className={`text-center text-lg font-bold ${set.tamamlandi ? 'text-accent' : 'text-muted'}`}>{no}</div>
      {!agirliksiz && (
        <SayiGirisi
          deger={set.kg}
          placeholder={fmt(onceki?.kg)}
          ondalik
          etiket={`Set ${no} kilo`}
          onDegis={(kg) => onDegis({ kg })}
        />
      )}
      <SayiGirisi
        deger={set.tekrar}
        placeholder={fmt(onceki?.tekrar)}
        ondalik={false}
        etiket={`Set ${no} ${birimKisa}`}
        onDegis={(tekrar) => onDegis({ tekrar })}
      />
      <button
        role="checkbox"
        aria-checked={set.tamamlandi}
        aria-label={`Set ${no} tamamlandı`}
        onClick={() => onTamamla(!set.tamamlandi)}
        className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 text-3xl transition ${
          set.tamamlandi ? 'border-accent bg-accent text-accent-fg' : 'border-line text-transparent hover:border-muted'
        }`}
      >
        <IkonTik />
      </button>
    </div>
  );
}

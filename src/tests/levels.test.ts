import { it, expect } from 'vitest';
import LEVELS from '../game/levels.json';
import { graphFromSmilesLite, structuralFormula, analyzeMolecule, elementKey } from '../chemistry/chemistryEngine';

it('every level target parses to the declared formula', () => {
  for (const l of LEVELS as any[]) {
    if (l.fragments) {
      for (const f of l.fragments) {
        const gf = graphFromSmilesLite(f.smiles);
        const a = analyzeMolecule(gf, { difficulty: 'sandbox' });
        expect(a.stability.status, `${l.id}/${f.name}: ${a.stability.reason}`).not.toBe('impossible');
        console.log(l.id, f.name, a.formula, a.stability.status);
      }
      continue;
    }
    const gr = graphFromSmilesLite(l.smiles);
    const a = analyzeMolecule(gr, { difficulty: 'sandbox' });
    const ok = elementKey(a.formula) === elementKey(l.formula);
    if (!ok) console.log('MISMATCH', l.id, l.name, 'got', a.formula, 'want', l.formula);
    expect(ok, `${l.id} ${l.name}: ${a.formula} vs ${l.formula}`).toBe(true);
    expect(a.stability.status, `${l.id}: ${a.stability.reason}`).not.toBe('impossible');
  }
  console.log('levels:', LEVELS.length);
});

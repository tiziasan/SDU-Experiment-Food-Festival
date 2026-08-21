# Analysis files

Generated from `js/catalog.js`, which is the single source of truth for
products and prices.

| File | Contents |
|---|---|
| `catalog.csv` / `catalog.json` | The 81 products: id, category, DA/EN names, package size, price |
| `catalog_for_prompt.txt` | Flat `id \| name \| size \| price \| category` list to paste into the LLM persona prompt |
| `co2_factors.csv` | `pack_weight_kg`, `co2e_kg_per_kg`, `co2e_kg_per_pack` per product |

`co2_factors.csv` is **not** loaded by the website — the shop must stay free of
any sustainability signal. Join it to the `basket_items` tab after the event:

```python
import pandas as pd
items = pd.read_csv('basket_items.csv')
co2   = pd.read_csv('data/co2_factors.csv')
df    = items.merge(co2[['product_id','co2e_kg_per_pack']], on='product_id')
df['co2e_kg'] = df.qty * df.co2e_kg_per_pack
basket = df.groupby('participant_id').co2e_kg.sum()
```

## Emission factors

Order-of-magnitude values in the range used by the Danish *Den Store
Klimadatabase* and Poore & Nemecek (2018), expressed as kg CO₂e per kg of
product at retail. They are good enough to rank baskets, which is what the
analysis needs; swap in the exact database values before publishing.

## Regenerating after a catalogue change

Edit `js/catalog.js`, then re-run the export script that produced these files
(re-parse `js/catalog.js` for id / cat / names / size / price and rewrite the
CSVs). New products also need a row in `co2_factors.csv` — its
`pack_weight_kg` and `co2e_kg_per_kg` are maintained by hand.

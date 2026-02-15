# Category Icon Updates

## Updated Icons for Better Visual Distinction

### Icon Mapping

| Category | Icon | Description |
|----------|------|-------------|
| **Yarn** | `Layers` | Stacked layers representing yarn rolls |
| **Fabric Suppliers** | `Shirt` | Fabric/clothing icon |
| **Knitting** | `Zap` | Lightning bolt for fast knitting action |
| **Buying Agents** | `Users` | Multiple people representing agents |
| **Printing** | `Printer` | Printer icon for printing services |
| **Threads** | `Wind` | Wind/thread bundle icon |
| **Trims & Accessories** | `Package` | Package/box for accessories |
| **Dyes & Chemicals** | `FlaskConical` | Conical flask with chemicals |
| **Machineries** | `Settings` | Gear/settings for machinery |
| **Machine Spares** | `Wrench` | Spanner/wrench for spare parts |

## Changes Made

### Before:
- Yarn: Layers ✅ (kept)
- Fabric Suppliers: Scissors ❌ (changed)
- Threads: Layers ❌ (duplicate)
- Trims & Accessories: Scissors ❌ (duplicate)
- Dyes & Chemicals: Droplet ❌ (generic)
- Machine Spares: Wrench ✅ (kept but using Spanner alias)

### After:
- All categories now have unique, relevant icons
- No duplicate icons
- Icons better represent their categories
- More professional and intuitive

## Files Updated

1. `src/app/page.tsx` - Home page category icons
2. `src/app/catalogue/page.tsx` - Catalogue page icon mapping

## Icon Descriptions

### Wind (Threads)
Represents thread bundles flowing like wind - perfect for thread category

### FlaskConical (Dyes & Chemicals)
Scientific conical flask icon - represents chemical/dye industry

### Wrench/Spanner (Machine Spares)
Tool icon representing spare parts and maintenance

### Package (Trims & Accessories)
Box/package icon for accessories and trim items

### Zap (Knitting)
Lightning bolt representing fast, dynamic knitting action

## Visual Impact

All icons are now:
- ✅ Unique (no duplicates)
- ✅ Relevant to their category
- ✅ Professional looking
- ✅ Easy to distinguish at a glance
- ✅ Consistent with Lucide React icon library

# yiitap-icon

> Build icon font from SVG files using [fantasticon](https://github.com/tancredi/fantasticon)

## Install
```bash
pnpm insall
```

## Build
```bash
pnpm build

# or

./build.sh
```
The built asset located in `dist` directory.

## Usage

### import CSS
```html
<link rel="stylesheet" type="text/css" href="yiitip-icon.css" />
```

### Icon
```html
<i class="yiitip-icon icon-close"></i>
```

### Preview all icons
Open `dist/yiitap-icon.html` to preview all icons.

## Icon
Icon SVG files from:
- [Material Symbols](https://fonts.google.com/icons)
- [Material Design Icons (mdi)](https://pictogrammers.com/library/mdi/)

### How to add a new icon
1. Get new icon's SVG file, and put it in `svg` fold.
2. Rename icon, please use `_`, `[0-9]`, and `[a-z]` only.
3. Rebuild.

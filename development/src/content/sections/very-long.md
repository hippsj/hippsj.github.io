---
published: false
id: very-long
order: 3
title: Six Words To Test The Wheel
description: This is a generated sample project with a 6-word title to
  demonstrate how the infinite scrolling wheel and content areas handle text
  length.
---
# Six Words To Test The Wheel

This project demonstrates the system's capability to handle technical documentation, specifically focusing on syntax highlighting, code blocks, and monospace fonts.

## 1\. Installation

To get started with the "Six Words" library, you'll need to install it via your package manager. We support both `npm` and `yarn`.

```bash
# Install via npm
npm install @six-words/wheel-test

# Install via yarn
yarn add @six-words/wheel-test
```

After installation, ensure that your environment variables are set up correctly. You can do this by creating a `.env` file in your root directory.

```bash
touch .env
echo "WHEEL_RADIUS=500" >> .env
echo "ROTATION_SPEED=0.5" >> .env
```

## 2\. Configuration

The library relies on a rigid configuration schema. Below is an example of a `wheel.config.json` file. Notice how the nested objects are rendered.

```json
{
  "core": {
    "physics": {
      "friction": 0.05,
      "mass": 10.0,
      "drag": 0.01
    },
    "rendering": {
      "fps_limit": 60,
      "anti_aliasing": true
    }
  },
  "ui": {
    "theme": "dark",
    "primary_color": "#ff0055"
  }
}
```

If you prefer YAML, the configuration would look like this:

```yaml
core:
  physics:
    friction: 0.05
    mass: 10.0
  rendering:
    fps_limit: 60
ui:
  theme: dark
```

## 3\. Usage Example

Here is a basic example of how to initialize the wheel and add event listeners.

### JavaScript (ES6)

```javascript
import { Wheel, Item } from '@six-words/wheel-test';

const myWheel = new Wheel({
  container: document.getElementById('app'),
  radius: 300,
  items: [
    new Item('Short'),
    new Item('Medium Title'),
    new Item('Very Long Title Example'),
  ]
});

// Event Listener for rotation
myWheel.on('spin', (velocity) => {
  console.log(`The wheel is spinning at ${velocity} rpm.`);
  
  if (velocity > 100) {
    console.warn('Warning: Maximum velocity approaching!');
  }
});

myWheel.mount();
```

### Python Binding

If you are using the Python backend, the syntax is slightly different but follows the same principles.

```python
from six_words import Wheel, Item

def on_spin(velocity):
    print(f"The wheel is spinning at {velocity} rpm.")

wheel = Wheel(radius=300)
wheel.add_items([
    Item("Short"),
    Item("Medium Title")
])

wheel.on_spin = on_spin
wheel.mount()
```

## 4\. Advanced Concepts

When building complex interfaces, you might need to extend the default `Item` class.

```typescript
interface CustomItemProps {
  label: string;
  icon: string;
  isActive: boolean;
}

class AdvancedItem extends Item {
  constructor(props: CustomItemProps) {
    super(props.label);
    this.icon = props.icon;
  }

  render() {
    return `<div class="item ${this.isActive ? 'active' : ''}">
              <i class="icon-${this.icon}"></i>
              <span>${this.label}</span>
            </div>`;
  }
}
```

## 5\. Troubleshooting

If you encounter the `RotationError: NaN` exception, it usually means the `friction` coefficient is set to `0`.

> **Note:** Always ensure `friction > 0` to prevent infinite loops in the physics engine.

To debug, run the initialization with the `--debug` flag:

```bash
npm run start -- --debug
```

This concludes the technical demonstration for the **Six Words To Test The Wheel** project.
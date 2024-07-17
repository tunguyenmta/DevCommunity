

// export default StyledImage;
import Quill from 'quill';

interface StyledImageAttributes {
  src: string;
  style?: string;
}

interface IStyledImageInstance {
  domNode: HTMLElement;
  format(name: string, value: string): void;
}

// Define the interface for the class itself since create and value are static
interface IStyledImageClass {
  new (): IStyledImageInstance;
  create(value: StyledImageAttributes | string): HTMLElement;
  value(domNode: HTMLElement): StyledImageAttributes;
}

// Declare a type that includes the required `domNode`
type StyledImageInstance = IStyledImageInstance & {
  domNode: HTMLElement;
};

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

let StyledImage: IStyledImageClass | undefined;

if (isBrowser) {
  const ImageBlot = Quill.import('formats/image');

  class StyledImageClass extends ImageBlot implements StyledImageInstance {
    // Declare domNode explicitly to satisfy TypeScript
    public domNode!: HTMLElement;

    static create(value: StyledImageAttributes | string): HTMLElement {
      let node = super.create(value) as HTMLElement;
      if (typeof value === 'object') {
        node.setAttribute('src', value.src);
        if (value.style) {
          node.setAttribute('style', value.style);
        }
      } else {
        node.setAttribute('src', value);
      }
      return node;
    }

    static value(domNode: HTMLElement): StyledImageAttributes {
      return {
        src: domNode.getAttribute('src') || '',
        style: domNode.getAttribute('style') || ''
      };
    }

    format(name: string, value: string): void {
      if (name === 'style' && this.domNode) {
        this.domNode.setAttribute('style', value);
      } else {
        super.format(name, value);
      }
    }
  }

  StyledImage = StyledImageClass;
}

export default StyledImage;

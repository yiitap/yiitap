import { Node } from '@tiptap/core';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        callout: {
            /**
             * Set a callout node
             */
            setCallout: () => ReturnType;
            /**
             * Toggle a callout node
             */
            toggleCallout: () => ReturnType;
            /**
             * Unset a callout node
             */
            unsetCallout: () => ReturnType;
        };
    }
}
export interface CalloutOptions {
    HTMLAttributes: Record<string, any>;
}
export declare const Callout: Node<CalloutOptions, any>;

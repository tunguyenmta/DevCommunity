declare type TabLabel = 'HTML' | 'CSS' | 'JavaScript';

declare type TagProps = {
    id: number;
    name: string;
}

declare type CodeSnippets = {
    html: string;
    css: string;
    javascript: string;
};

declare type PropCodeEditor = {

    title: string | undefined;
    desc: string | undefined;

};

declare type PropsCmp = {
    code: {
        html: string;
        css: string;
        javascript: string;
    };
    activeTab: 'HTML' | 'CSS' | 'JavaScript';

};


interface Example {
    commit: string;
}

interface DataObject {
    id: number;
    code: string;
    componentId: number;
    examples: Example[];
}

// api components

interface Cover {
    path: string;
    mediaType: string;
    originalName: string;
}

interface Component {
    id: number;
    title: string;
    cover: Cover;
    resource: {
        html: string;
        css: string;
        javascript: string;
    };
}


interface Folder {
    id: number;
    name: string;
    totalComponent: number
    components: Component[];
}

interface ShowComponentData {
    folders: Folder[];
    components: Component[];
}


// show detail components

interface HashTag {
    id: number;
    name: string;
}

interface SourceCode {
    path: string;
    mediaType: string;
    originalName: string;
}

interface Example {
    id: number;
    title: string;
    description: string;
    video: string | null;
    sourceCode: SourceCode;
    cover: SourceCode;
    resource: {
        html: string;
        css: string;
        javascript: string;
    };
}

interface ShowComponentDetail {
    id: number;
    title: string;
    description: string;
    whenToUse: string;
    cover: SourceCode;
    category: {
        id: number;
        name: string;
    };
    hashTagList: HashTag[];
    examples: Example[];
}


// comment
interface Comment {
    id: number;
    content: string;
    parentId: number | null;
    createdDate: string;
    nickName: string;
}

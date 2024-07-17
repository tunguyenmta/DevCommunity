declare type TabLabel = 'HTML' | 'CSS' | 'JavaScript';

declare type CodeSnippets = {
    html: string;
    css: string;
    javascript: string;
    typescript: string,
    java: string,
    database: string
};

declare type Props = {
    code: {
        html: string;
        css: string;
        javascript: string;
        typescript: string,
        java: string,
        database: string
    };
    activeTab: 'HTML' | 'CSS' | 'JavaScript' | 'TypeScript' | 'Java' | 'Database';
    isClicked: boolean;
    handleScreenShot: (url: string) => void;
};
import React from "react";
import RelatedItems from "./RelatedItems";

interface RelatiedItemsProps {
    component: {
        id: string;
    };
    title: string;
    resource: {
        html: string;
        css: string;
        javascript: string;
    };
}

interface RelatedProps {
    relateComponent: RelatiedItemsProps[];
}

const RelateComponents: React.FC<RelatedProps> = ({ relateComponent }) => {
    return (
        <div>
            {relateComponent && relateComponent.length > 0 && (
                <>
                    <h1 className="leading-7 font-inter font-bold text-2xl text-black1 text-nowrap">Related components</h1>
                    {relateComponent.map((item, index) => (
                        <a href={`/showcomponents/${item.component.id}`} key={item.component.id}>
                            <RelatedItems cover={item.resource} title={item.title} />
                        </a>
                    ))}
                </>
            )}
        </div>
    );
};

export default RelateComponents;

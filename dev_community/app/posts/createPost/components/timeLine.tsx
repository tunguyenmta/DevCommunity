
"use client";
import React, {useState, useEffect} from "react";
import { DownOutlined } from "@ant-design/icons";
import { LiaChevronCircleDownSolid } from "react-icons/lia";
import { LiaChevronCircleRightSolid } from "react-icons/lia";

import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import "./timeLine.css";
interface TreeNode {
  key: string;
  href: string;
  title: string;
  type: string;
  count?: number;
  children?: TreeNode[];
}


interface TimeLineProps {
  listHeading: TreeNode[];
  scrollToText: (text: string, count: number) => void;
}

function transformNode(node: TreeNode): TreeNode {
  return {
    title: node.title,
    key: node.key,
    href: node.href,
    type: node.type,
    count: node.count,
    children: node.children ? node.children.map(transformNode) : undefined,
  };
}
const TimeLine: React.FC<TimeLineProps> = ({ listHeading, scrollToText }) => {
  const onSelect: TreeProps["onSelect"] = (selectedKeys, info: any) => {
    const node = info.node as TreeNode;
    if (node.title && node.count !== undefined) {
      scrollToText(node.title, node.count);
    }
  };
  const transformedTreeData = listHeading.map(transformNode);
  return (
    <Tree
      showLine
      switcherIcon={({
        isLeaf,
        expanded,
      }: {
        isLeaf?: any;
        expanded?: any;
      }) => {
        if (isLeaf) {
          return null; // return null or some other icon for leaf nodes
        }
        return expanded ? (
          <LiaChevronCircleDownSolid className="w-[20px] h-[20px] text-blue3" />
        ) : (
          <LiaChevronCircleRightSolid className="w-[20px] h-[20px] text-blue3" />
        );
      }}
      defaultExpandedKeys={["0-0-0"]}
      onSelect={onSelect}
      treeData={transformedTreeData}
    />
  );
};

export default TimeLine;

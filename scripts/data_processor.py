#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CyberWise 数据集处理器
用于读取和处理385_quesions_dataset.xlsx文件
"""

import pandas as pd
import json
import os
from datetime import datetime

class DatasetProcessor:
    def __init__(self, excel_file_path):
        """初始化数据处理器"""
        self.excel_file_path = excel_file_path
        self.df = None
        self.processed_data = []
        
    def load_dataset(self):
        """加载Excel数据集"""
        try:
            print(f"正在读取数据集: {self.excel_file_path}")
            self.df = pd.read_excel(self.excel_file_path)
            print(f"数据集加载成功! 共有 {len(self.df)} 条记录")
            print("\n数据集列名:")
            for i, col in enumerate(self.df.columns):
                print(f"{i+1}. {col}")
            print("\n数据集前几行预览:")
            print(self.df.head())
            return True
        except Exception as e:
            print(f"读取数据集失败: {e}")
            return False
    
    def analyze_structure(self):
        """分析数据结构"""
        if self.df is None:
            print("请先加载数据集")
            return
        
        print("\n=== 数据集结构分析 ===")
        print(f"总行数: {len(self.df)}")
        print(f"总列数: {len(self.df.columns)}")
        
        print("\n各列数据类型:")
        for col in self.df.columns:
            print(f"- {col}: {self.df[col].dtype}")
            
        print("\n各列缺失值统计:")
        for col in self.df.columns:
            missing_count = self.df[col].isnull().sum()
            missing_percent = (missing_count / len(self.df)) * 100
            print(f"- {col}: {missing_count} ({missing_percent:.1f}%)")
    
    def process_for_cyberwise(self):
        """处理数据，转换为CyberWise知识库格式"""
        if self.df is None:
            print("请先加载数据集")
            return
        
        print("\n=== 处理数据为CyberWise格式 ===")
        
        processed_count = 0
        for index, row in self.df.iterrows():
            try:
                # 提取基本信息
                record = {
                    "id": f"dataset_{index}",
                    "index": int(row.get('Index', index)) if pd.notna(row.get('Index')) else index,
                    "title": str(row.get('question', '')) if pd.notna(row.get('question')) else f"Question {index}",
                    "question": str(row.get('question', '')) if pd.notna(row.get('question')) else '',
                    "human_answer": str(row.get('human_answer', '')) if pd.notna(row.get('human_answer')) else '',
                    "ai_answer": str(row.get('AI_answer', '')) if pd.notna(row.get('AI_answer')) else '',
                    "category": str(row.get('category', 'Uncategorized')) if pd.notna(row.get('category')) else 'Uncategorized',
                    "subcategory": str(row.get('subcategory', '')) if pd.notna(row.get('subcategory')) else '',
                    "created_at": datetime.now().isoformat(),
                    "source": "dataset_385_questions",
                    "type": "qa_pair"
                }
                
                self.processed_data.append(record)
                processed_count += 1
                
            except Exception as e:
                print(f"处理第 {index} 行时出错: {e}")
                continue
        
        print(f"成功处理 {processed_count} 条记录")
        return self.processed_data
    
    def save_as_json(self, output_file):
        """保存为JSON格式"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.processed_data, f, ensure_ascii=False, indent=2)
            print(f"数据已保存为: {output_file}")
            return True
        except Exception as e:
            print(f"保存JSON文件失败: {e}")
            return False
    
    def generate_search_index(self):
        """生成搜索索引"""
        search_index = []
        for record in self.processed_data:
            index_entry = {
                "id": record["id"],
                "index": record["index"],
                "title": record["title"],
                "content": f"{record['question']} {record['human_answer']} {record['ai_answer']}",
                "category": record["category"],
                "subcategory": record["subcategory"],
                "keywords": self._extract_keywords(record)
            }
            search_index.append(index_entry)
        return search_index
    
    def _extract_keywords(self, record):
        """提取关键词"""
        text = f"{record['title']} {record['question']} {record['category']} {record['subcategory']}"
        # 简单的关键词提取（可以后续优化）
        words = text.lower().split()
        keywords = list(set([word for word in words if len(word) > 3]))
        return keywords[:10]  # 限制关键词数量

def main():
    # 数据集文件路径
    excel_path = "task/task 2/category definition/385_quesions_dataset.xlsx"
    output_dir = "static/data/"
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 创建处理器
    processor = DatasetProcessor(excel_path)
    
    # 加载数据集
    if not processor.load_dataset():
        return
    
    # 分析结构
    processor.analyze_structure()
    
    # 处理数据
    processed_data = processor.process_for_cyberwise()
    if not processed_data:
        print("数据处理失败")
        return
    
    # 保存处理后的数据
    json_output = os.path.join(output_dir, "questions_dataset.json")
    processor.save_as_json(json_output)
    
    # 生成搜索索引
    search_index = processor.generate_search_index()
    index_output = os.path.join(output_dir, "search_index.json")
    with open(index_output, 'w', encoding='utf-8') as f:
        json.dump(search_index, f, ensure_ascii=False, indent=2)
    print(f"搜索索引已保存为: {index_output}")
    
    # 生成统计信息
    stats = {
        "total_questions": len(processed_data),
        "categories": list(set([item["category"] for item in processed_data])),
        "subcategories": list(set([item["subcategory"] for item in processed_data if item["subcategory"]])),
        "generated_at": datetime.now().isoformat()
    }
    
    stats_output = os.path.join(output_dir, "dataset_stats.json")
    with open(stats_output, 'w', encoding='utf-8') as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    print(f"统计信息已保存为: {stats_output}")
    
    print("\n=== 数据处理完成 ===")
    print(f"总共处理了 {len(processed_data)} 个问题")
    print(f"分类数量: {len(stats['categories'])}")
    print(f"子分类数量: {len(stats['subcategories'])}")

if __name__ == "__main__":
    main() 
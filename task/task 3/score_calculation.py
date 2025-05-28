import csv
import re
import pandas as pd

read_human = "D:\\Adelaide\\MyAdelaide\\project\\vaderSentiment-master\\output_human.csv"
read_AI = "D:\\Adelaide\\MyAdelaide\\project\\vaderSentiment-master\\output_AI.csv"
output_human_emo = "D:\\Adelaide\\MyAdelaide\\project\\vaderSentiment-master\\output_human_emo.csv"
output_AI_emo = "D:\\Adelaide\\MyAdelaide\\project\\vaderSentiment-master\\output_AI_emo.csv"


def classify_sentiment(file_path, output_path):
    with open(file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader) 
        # 提取第二列的'compound'值并进行分类
        for row in reader:
            if len(row) > 1: 
                match = re.search(r"'compound': ([\d\.\-]+)", row[1])
                if match:
                    compound_value = float(match.group(1)) 
                    if compound_value > 0.05:
                        sentiment = 'positive'
                    elif compound_value < -0.05:
                        sentiment = 'negative'
                    else:
                        sentiment = 'neutral'
                        
                    # 将分类结果写入新的csv文件
                    with open(output_path, 'a', newline='', encoding='utf-8') as outputfile:
                        writer = csv.writer(outputfile)
                        writer.writerow([row[0], sentiment])


classify_sentiment(read_human, output_human_emo)
print("Finished processing human sentiment classification.")
classify_sentiment(read_AI, output_AI_emo)
print("Finished processing AI sentiment classification.")
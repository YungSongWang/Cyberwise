from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pandas as pd
import csv

# 分别逐行读取csv文件的第七和第八列，把内容存到两个列表中（sentences_7和sentences_8）
filename = "D:\\Adelaide\\MyAdelaide\\project\\vaderSentiment-master\\385_quesions_dataset.csv"
output_file_human = "D:\\Adelaide\\MyAdelaide\\project\\vaderSentiment-master\\output_human.csv"
output_file_AI = "D:\\Adelaide\\MyAdelaide\\project\\vaderSentiment-master\\output_AI.csv"

with open(filename, 'r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    sentences_7 = []
    sentences_8 = []

    next(reader)
    for row in reader:
        if len(row) > 6:  
            sentences_7.append(row[6])
        if len(row) > 7:  
            sentences_8.append(row[7])

# 用Vader分析7列的数据,并将结果写入output_human.csv
with open(output_file_human, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Sentence', 'Sentiment'])  
    analyzer = SentimentIntensityAnalyzer()
    counter = 0
    for sentence in sentences_7:
        vs = analyzer.polarity_scores(sentence)
        writer.writerow([sentence, str(vs)])
        counter += 1
        if counter % 10 == 0:
            print(f"Processed {counter} sentences from column 7.")

print("Finished processing column 7. Now processing column 8.")

# 用Vader分析8列的数据,并将结果写入output_AI.csv
with open(output_file_AI, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Sentence', 'Sentiment'])  
    analyzer = SentimentIntensityAnalyzer()
    counter = 0
    for sentence in sentences_8:
        vs = analyzer.polarity_scores(sentence)
        writer.writerow([sentence, str(vs)])
        counter += 1
        if counter % 10 == 0:
            print(f"Processed {counter} sentences from column 8.")

print("Finished processing column 8.")
print("All processing complete. Output files are ready.")
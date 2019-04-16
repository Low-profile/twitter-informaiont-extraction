#!  /usr/bin/env python
import tensorflow as tf
import numpy as np
import os
import time
import datetime
import data_helpers
from text_cnn import TextCNN
from tensorflow.contrib import learn
import csv
import json

import sys

import anago
from anago.reader import load_data_and_labels
import gensim
from gensim.models.keyedvectors import KeyedVectors
from scipy.spatial import distance

from difflib import SequenceMatcher
import Levenshtein

import ner_mod as nermod
import pandas as pd




#stop_df=pd.read_csv('stops.csv')
stop_df=pd.read_csv('stops_portland.txt')

stop_df['stop_name'] = stop_df['stop_name'].str.lower()

def similar(a, b):
    return 1.0 - SequenceMatcher(None, a, b).ratio()

def data_preprocessing():
    f = open('filtered_col.txt', 'r', encoding = 'utf-8')
    res = open('delayed_2.txt', 'w', encoding = 'utf-8')
    non_delay_file = open('non_delayed.txt', 'w', encoding = 'utf-8')


    delayed_words = ['late','delay','early','on time']

    for line in f:
        if any(x in line for x in delayed_words):
            print(line, file=res, end="")
        else:
            print(line, file=non_delay_file, end = "")

def linecounts(filename):
    file = open(filename, 'r', encoding = 'utf-8')
    count = 0
    for line in file:
        count += 1
    file.close()
    return count
          
class QueryProcessing(object):
    def __init__(self):
        #Load Google's pre-trained Word2Vec model
        self.model = gensim.models.KeyedVectors.load_word2vec_format('./GoogleNews-vectors-negative300.bin',limit=300000, binary=True)
        self.model.init_sims(replace=True)
        print("load_complete")
        self.punctuation = ['!','?','.',',',';','>','<','@rideuta']
        #filename = 'stops.txt'
        #self.matRows = linecounts(filename)
        list_stops = stop_df['stop_name'].tolist()
        self.matRows = len(list_stops)
        #self.sentenceStr = []
        self.sentenceStr = np.empty((self.matRows, 1), dtype=object)
        self.Veclength = 300
        #存放所有问题向量的矩阵，初始化
        self.sentenceMat = np.zeros((self.matRows, self.Veclength))
        index = 0

        #f = open(filename, 'r', encoding = 'utf-8')

        invalid_count = 0
        
        for line in list_stops:
            validCount = 0
            self.sentenceStr[index] = line.rstrip('\n').lower()

            line = line.lower()
            for p in list(self.punctuation):
                line = line.replace(p,' ')
            words = line.split()
            for word in words:
                try:
                    if word.isdigit():
                        word = '#' * len(word)
                    # print(word)
                    self.sentenceMat[index] += self.model[word]
                    validCount += 1
                    # res = model.most_similar(word, topn=5)
                except KeyError:
                    invalid_count += 1
                    #print( word + " not in vocabulary.\n")
                    continue
                    # for item in res:
                    # print(item[0] + "," + str(item[1]))
                    # print('\n')
            self.sentenceMat[index] /= validCount
            index += 1
        print("invalid numbers ",invalid_count,"\n")
        #f.close()
    def stringquery(self, queryStr):
        cosDist = np.zeros((self.matRows, 1))
        
        queryStr = queryStr.lower()
        for p in list(self.punctuation):
            queryStr = queryStr.replace(p,' ')
        userWords = queryStr.split()
        validCount = 0
        invalid_count = 0

        #遍历查询句子的所有词，计算词向量，相加求平均作为这个句子的向量
        #userWordsVec = np.zeros((1, self.Veclength))
        #for word in userWords:
        #    try:
        #        if word.isdigit():
        #            word = '#' * len(word)
        #        # print(word)
        #        userWordsVec += self.model[word]
        #        validCount += 1
        #        # res = model.most_similar(word, topn=5)
        #    except KeyError:
        #        #print("not in vocabulary.")
        #        invalid_count += 1
        #        continue
        #        # for item in res:
        #        # print(item[0] + "," + str(item[1]))
        #        # print('\n')
        #userWordsVec /= validCount


        #计算查询句子与库中所有问题的向量的距离，得到一个全是距离的数组cosDist
        dist = np.zeros((self.matRows, 1))
        #ratcliffDist = np.zeros((self.matRows, 1))
        for index in range(len(self.sentenceMat)):
            #cosDist = distance.cosine(self.sentenceMat[index], userWordsVec)

            #ratcliffDist = similar(self.sentenceStr[index][0], queryStr)
            #dist[index] = 0.9 * cosDist + 0.1 * ratcliffDist
            levenDist = Levenshtein.ratio(self.sentenceStr[index][0], queryStr)
            dist[index] = 1 - levenDist
            
            
        #对数组进行排序，得到按距离排过序的问题下标
        sortedIndex = np.argsort(dist, axis=0)

        sortedDist = dist[sortedIndex]

        #if sortedDist[:5,::].mean() < 0.3:
        #    return self.sentenceStr[sortedIndex[:5,::]]
        if sortedDist[0][0] < 0.41:
            return self.sentenceStr[sortedIndex[:5,::]]
        else:
            return []
    def wordQuery(self, queryWord):
        try:
            print(self.model.most_similar(queryWord))
            
        except KeyError:
            print(queryWord,"not in vocabulary.\n")

def init():
    # Data Parameters
    tf.flags.DEFINE_string("positive_data_file", "./data/rt-polaritydata/rt-polarity.pos", "Data source for the positive data.")
    tf.flags.DEFINE_string("negative_data_file", "./data/rt-polaritydata/rt-polarity.neg", "Data source for the negative data.")

    # Eval Parameters
    tf.flags.DEFINE_integer("batch_size", 64, "Batch Size (default: 64)")
    tf.flags.DEFINE_string("checkpoint_dir", "./runs/1520634781/checkpoints", "Checkpoint directory from training run")
    tf.flags.DEFINE_boolean("eval_train", False, "Evaluate on all training data")

    # Misc Parameters
    tf.flags.DEFINE_boolean("allow_soft_placement", True, "Allow device soft device placement")
    tf.flags.DEFINE_boolean("log_device_placement", False, "Log placement of ops on devices")

    # Parameters
    # ==================================================

    FLAGS = tf.flags.FLAGS
    FLAGS(sys.argv)
    print("\nParameters:")

    for attr, value in sorted(FLAGS.__flags.items()):
        print("{}={}".format(attr.upper(), value))

    print("")


    # Map data into vocabulary
    vocab_path = os.path.join(FLAGS.checkpoint_dir, "..", "vocab")
    vocab_processor = learn.preprocessing.VocabularyProcessor.restore(vocab_path)

    print("\nEvaluating...\n")

    # Evaluation
    # ==================================================
    checkpoint_file = tf.train.latest_checkpoint(FLAGS.checkpoint_dir)
    graph = tf.Graph()
    with graph.as_default():
        session_conf = tf.ConfigProto(allow_soft_placement=FLAGS.allow_soft_placement,
          log_device_placement=FLAGS.log_device_placement)
        sess = tf.Session(config=session_conf)
        with sess.as_default():
            # Load the saved meta graph and restore variables
            saver = tf.train.import_meta_graph("{}.meta".format(checkpoint_file))
            saver.restore(sess, checkpoint_file)

            # Get the placeholders from the graph by name
            input_x = graph.get_operation_by_name("input_x").outputs[0]
            # input_y = graph.get_operation_by_name("input_y").outputs[0]
            dropout_keep_prob = graph.get_operation_by_name("dropout_keep_prob").outputs[0]

            # Tensors we want to evaluate
            predictions = graph.get_operation_by_name("output/predictions").outputs[0]
            
    dir_path = 'result'
    model = anago.Sequence.load(dir_path)
    qp = QueryProcessing()
    return sess,predictions,vocab_processor,FLAGS,input_x,dropout_keep_prob,model,qp

def is_delayed(str,sess, predictions, vocab_processor,FLAGS,input_x,dropout_keep_prob):
    #all_predictions = []
    #x_test = np.array(list(vocab_processor.transform([str])))
    #batches = data_helpers.batch_iter(list(x_test), FLAGS.batch_size, 1, shuffle=False)
    #for x_test_batch in batches:
    #    batch_predictions = sess.run(predictions, {input_x: x_test_batch, dropout_keep_prob: 1.0})
    #    all_predictions = np.concatenate([all_predictions, batch_predictions])
    
    x_test = np.array(list(vocab_processor.transform([str])))
    predict = sess.run(predictions, {input_x: x_test, dropout_keep_prob: 1.0})
    return predict

def ner_result(str,model,qp,all_predictions):
    list_stop_found = []
    list_stop_id = []
    processed_counter = 0

    #log_file = open("log.txt", 'w', newline='')

    #data_preprocessing()
    #log_file.write(",".join(all_predictions[i].astype(str)))
    #log_file.write(',')
    if all_predictions:
        words = str.lower().replace('@rideuta','')
        res = model.analyze(words.split())
        founded = False
        for phrase in res['entities']:
            if (phrase['type'] == 'NP'): 
                res = qp.stringquery(phrase['text'])
                #print(phrase['text'])
                if len(res):
                    founded = True
                    list_stop_found.append(res[0][0][0])
                    list_stop_id.append(stop_df.loc[stop_df['stop_name']==res[0][0][0],'stop_id'].values[0])
                    #log_file.write(res[0][0][0])
                    break
        if not founded:
            list_stop_found.append('')
            list_stop_id.append('')
    else:
        list_stop_found.append('')
        list_stop_id.append('')
    #log_file.write('\n')
    processed_counter += 1    
    if processed_counter % 10 == 0:
        print("processed", processed_counter)

    #timex_found,bus_found,stop_found,stop_id,text = nermod.tag(sent)
    #list_stop_id += [stop_id]
    #list_stop_found += [stop_found]
    print("processe completed")
    # Save the evaluation to a csv
    #col_tuples =
    predictions_human_readable = [str] + [all_predictions[0]] + list_stop_found + list_stop_id
    return predictions_human_readable

def main():    
    sess, predictions, vocab_processor,FLAGS,input_x,dropout_keep_prob,model,qp = init()
    # Collect the predictions here
    all_predictions = []

    #while True:
    # CHANGE THIS: Load data.  Load your own data here
    #if FLAGS.eval_train:
    #    x_raw, y_test =
    #    data_helpers.load_data_and_labels(FLAGS.positive_data_file,
    #    FLAGS.negative_data_file)
    #    y_test = np.argmax(y_test, axis=1)
    #else:
    #input_file_name = 'uta_time_username.csv'
    input_file_name = 'portland_tweets_link.csv'

    with open(input_file_name,'r', encoding='utf-8') as twitters:
        text = []
        links = []
        usernames = []
        time = []
        for x in twitters.readlines():
            fields = x.split(";")
            #if len(fields) == 2:
            if len(fields) == 2:

                #usernames.append(fields[0].rstrip())
                #time.append(fields[1].rstrip())
                #text.append(fields[2].rstrip())
                #links.append(fields[3].rstrip())
                text.append(fields[0].rstrip())
                links.append(fields[1].rstrip())
        #text = [x.split(";")[0].rstrip() for x in twitters.readlines() if len(x.split(";")) == 2]
        #text = twitters.read().splitlines()
        #links = [x.split(";")[1].rstrip() for x in twitters.readlines() if len(x.split(";")) == 2]
        #a = input()
        x_raw = text
        # Generate batches for one epoch
        x_test = np.array(list(vocab_processor.transform(x_raw)))


    batches = data_helpers.batch_iter(list(x_test), FLAGS.batch_size, 1, shuffle=False)
    for x_test_batch in batches:
        batch_predictions = sess.run(predictions, {input_x: x_test_batch, dropout_keep_prob: 1.0})
        all_predictions = np.concatenate([all_predictions, batch_predictions])
        

    # Print accuracy if y_test is defined
    #if y_test is not None:
    #    correct_predictions = float(sum(all_predictions == y_test))
    #    print("Total number of test examples: {}".format(len(y_test)))
    #    print("Accuracy: {:g}".format(correct_predictions/float(len(y_test))))

    #usernames = ['Lucy'] * len(x_raw)
    #time = ["16/03/2018 12:11:34"] * len(x_raw)

    dir_path = 'result'
    model = anago.Sequence.load(dir_path)

    list_stop_found = []
    list_stop_id = []

    qp = QueryProcessing()

    processed_counter = 0

    
    #log_file = open("log.txt", 'w', newline='')


    for i,words in enumerate(x_raw):
        #data_preprocessing()
        #log_file.write(",".join(all_predictions[i].astype(str)))
        #log_file.write(',')
        if all_predictions[i]:
            #words = words.lower().replace('@rideuta','')
            words = words.lower()
            res = model.analyze(words.split())
            founded = False
            for phrase in res['entities']:
                if (phrase['type'] == 'NP'): 
                    res = qp.stringquery(phrase['text'])
                    #print(phrase['text'])
                    if len(res):
                        founded = True
                        list_stop_found.append(res[0][0][0])
                        list_stop_id.append(stop_df.loc[stop_df['stop_name']==res[0][0][0],'stop_id'].values[0])
                        #log_file.write(res[0][0][0])
                        break
            if not founded:
                list_stop_found.append('')
                list_stop_id.append('')
        else:
            list_stop_found.append('')
            list_stop_id.append('')
        #log_file.write('\n')
        processed_counter += 1    
        if processed_counter % 10 == 0:
            print("processed", processed_counter)

        #timex_found,bus_found,stop_found,stop_id,text = nermod.tag(sent)
        #list_stop_id += [stop_id]
        #list_stop_found += [stop_found]
    print("processe completed")
    # Save the evaluation to a csv
    #col_tuples =
    #predictions_human_readable = np.column_stack((np.array(x_raw), all_predictions) + (usernames,) + (time,) + (list_stop_found,) + (list_stop_id,) + (links,))

    predictions_human_readable = np.column_stack((np.array(x_raw), all_predictions) + (list_stop_found,) + (list_stop_id,) + (links,))
    #predictions_human_readable =
    #np.column_stack((predictions_human_readable,usernames))
    #predictions_human_readable =
    #np.column_stack((predictions_human_readable,time))
    #out_path = os.path.join(FLAGS.checkpoint_dir, "..", "prediction_uta_time_username.csv")
    out_path = os.path.join(FLAGS.checkpoint_dir, "..", "prediction_tweet_link.csv")
    print("Saving evaluation to {0}".format(out_path))


    #fieldnames = ["content","is_delayed","name","time","stop_name","stop_id","links"]
    fieldnames = ["content","is_delayed","stop_name","stop_id","links"]



    with open(out_path, 'w', newline='', encoding='utf-8') as f:
        csv.writer(f).writerow(fieldnames)
        csv.writer(f).writerows(predictions_human_readable)
	#aa
    with open(out_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        #ret = [row for row in reader]
        #with open('tmp_a.txt', 'w') as outfile:  
        with open('tweet_link.txt', 'w') as outfile:  
            outfile.write('[\n')
            for row in reader:
                if row['is_delayed'] == '1.0':
                    json.dump(row, outfile)
                    outfile.write(',\n')
            outfile.write(']\n')
    #json.dump(ret, outfile)
    #with open('hand_crafted_delayed.txt','r', encoding='utf-8') as twitters:
    #    text = [x.rstrip() for x in twitters.readlines()[:50]]
    #    #text = twitters.read().splitlines()
    #    #x_raw = ['how is the weather today','my name is nash','how are you']
    #    x_raw = text


#from app import app

if __name__ == "__main__":
    main()

    #app.run(host= '0.0.0.0',port = 8001, debug=False)
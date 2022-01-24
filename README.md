#  Dokumentasi
## Threads
### Add Threads
1. kita mulai dengan melakukan membuat table threads : npm run migrate create_table_threads
2. Lakukan helper test pada file test dengan membuat file ThreadsTableTestHelper.js
3. Kemudian, kita beranjak ke Domains.
   1. Buat folder dengan structur spt ini :
   ```
    threads\
        |--_test
            --ThreadRepository.test.js
        |--entities
            --_test
                --AddedThread.test.js   # untuk menampung data yang dihasilkan o/ repository setelah memasukkan thread baru
                --NewThread.test.js     # untuk menampung data yang akan dimasukkan k DB via repository
            --AddedThread.js              
            --NewThread.js                 
        |--ThreadRepository.js            
    ```
    -  NewThread.js : menerima 3 parameter (owner, title, body) yang kemudian akan di verifikasi apakah data yang masuk terpenuhi semua? dan apakah jenis data yang masuk sudah berupa string?. 
    - 
   2. Kemudian kita lanjut ke folder Applications, tepatnya pada use_case -nya. Dengan membuat folder threads yang akan menampung domains dari threads diatas. Namun, karena dalam thread terdapat owner yang mana, berhubungan dengan users maka kita perlu menambahkan suatu function owner di dalam UserRepository.js dengan parameter berupa id.
   3.  
   4. 

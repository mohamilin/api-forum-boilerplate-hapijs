### DOKUMENTASI AUTH
1. Kita akan memulai dengan instalasi sebagai berikut :
    - npm init -y
    - npm install @hapi/hapi @hapi/jwt bcrypt dotenv nanoid pg --save
    - npm install @types/jest eslint jest node-pg-migrate nodemon --save-dev
    - [Optional] npx eslint --init 
    - Tambahkan file .gitignore untuk membatasi folder/file yang tidak perlu di kirim ke repo
    - Tambahkan code pada bagian script pada file package.json
    ```json
     "scripts": {
        "start": "node src/app.js",
        "start:dev": "nodemon src/app.js",
        "test": "jest --setupFiles dotenv/config",
        "test:watch": "jest --watchAll --coverage --setupFiles dotenv/config",
        "migrate": "node-pg-migrate",
        "migrate:test": "node-pg-migrate -f config/database/test.json"
    },
    ``` 
2. Persiapan Database
    - Buat 2 database : database main (api_auth) dan database test (api_auth_test), tujuannya agar setiap ada pengujian/test hanya database pada test yang berubah.
    - Kemudian lakukan konfigurasi pada file .env
    - Buat file test.json pada config/database
    - Jalankan npm run migrate up dan npm run migrate:test up agar table pada folder migrations masuk ke dalam database di local/server kita.
4.  Pool Connection
    - Bertujuan agar dapat mengakses database postgres yang telah kita buat. 
    - Pembuatan Pool Connection dengan membuat file pool.js yang dilakukan didalam folder Infrastructures/database/postgres.
    - Berikan /* istanbul ignore file */ pada line 1 agar ketika test dilakukan file ini tidak ikut serta di test.
5. Persiapan Kebutuhan Testing
    - Buat folder tests pada root project dengan berisikan testing users dan authenctications. untuk namanya UsersTableTestHelper.js dan AuthenticationsTableTestHelper.js
    - Berikan /* istanbul ignore file */ pada line 1 agar ketika test dilakukan file ini tidak ikut serta di test.
    - Kode yang terdapat pada kedua file hanya digunakan untuk membantu proses pengujian saja, tidak digunakan sebagai kode production. Jadi Anda tidak perlu khawatir bila kode tidak dituliskan dengan TDD, karena memang kode tersebut tidak perlu diuji.


#### Custom Error
1. Setelah instalasi dan konfigurasi database, selanjutnya kita buat handling error dengan custom
2. Ada 4 handler error yang dibuat yaitu : ClientError, InvariantError, AuthenticationError, dan NotFoundError.
   - ClientError : terjadi di sisi client dengan sifat abstrak untuk menggunakan class ini lebih baik gunakan turunannya saja.
   - InvariantError : terjadi karena kesalahan bisnis logic pada data yang dikirimkan oleh client, contohnya kesalahan karena validasi.
   - AuthenticationError : terjadi karena authentikasi, contohnya password yang salah atau refresh token yang tdk valid.
   - NotFoundError : terjadi karena resource yang dibutuhkan tidak ditemukan. 
3. Catatan :
   - Untuk ClientError dan setiap turunannya harus punya statusCode.
   - untuk Testing buat folder _test pada folder Commons/exceptions dan sesuaikan nama file test sebagaimana yang terdapat pada folder exceptions, contohnya ClientError.test.js
4. [Handle Error] ClientError
   - Buat file  ClientError.js pada folder Commons/exceptions.
   - Lakukan TDD dengan menulis code testnya terlebih dahulu. di dala, folder Commons/exceptions/_test
5. [Handle Error] InvariantError
   - Lakukan TDD dengan menulis code testnya terlebih dahulu. di dala, folder Commons/exceptions/_test
   - Dalam folder  InvariantError.js akan di buat class dengan extends dari ClientError
6. [Handle Error] AuthenticationError
    - Lakukan TDD dengan menulis code testnya terlebih dahulu. di dala, folder Commons/exceptions/_test
   - Dalam folder  AuthenticationError.js akan di buat class dengan extends dari ClientError
   - status code 401
7. [Handle Error] NotFoundError
   - Lakukan TDD dengan menulis code testnya terlebih dahulu. di dala, folder Commons/exceptions/_test
   - Dalam folder  NotFoundError.js akan di buat class dengan extends dari ClientError
   - status code 404
8. Setelah, buat handle error dengan menerapkan TDD, selanjutnya membuat fitur Auth API
   - Melayani permintaan registrasi pengguna;
   - Mendapatkan autentikasi atau proses login;
   - Memperbarui autentikasi atau proses refresh access token;
   - Menghapus autentikasi atau proses logout;

#### Fitur Registrasi Pengguna
##### Membuat User Domain
1. Ada 2 hal yang harus dibuat, yaitu entities dan repository (dalam hal ini UserRepository)
2. Untuk entities yang akan kita buat ada 2, yaitu 
   - RegisterUser : untuk menampung data yang akan dimasukkan k DB via repository
   - RegisteredUser : untuk menampung data yang dihasilkan o/ repository setelah memasukkan user baru.
3. Buat RegisterUser.js pada Domains/users/entities dan RegisterUser.test.js pada Domains/users/entities/_test
   - Pesan error yang ditampilkan memiliki format terntu, tujuannya agar <strong> Kode bisnis di dalam Domains dan Applications tidak memiliki ketergantungan terhadap folder lain. </strong>
   - Ada 4 test :
     - Should throw error when payload did not contain needed property
     - Should throw error when payload did not meet data type specification
     - Should throw error when username contains more than 50 character
     - should throw error when username contains restricted character
     - Should create registerUser object correctly
4. Kemudian Kita buat entities RegisteredUser, sebagai penampung data pengguna yang baru saja masuk k dalam DB.
   - Buat file RegisteredUser.js dan RegisteredUser.test.js sejajar dengan file RegisterUser.js dan RegisterUser.test.js
   - Kemudian lakukan TDD sebagaimana diatas
   - Ada 3 test :
     - should throw error when payload did not contain needed property
     - should throw error when payload did not meet data type specification
     - should create registerUser object correctly

##### Membuat UserRepository Interface
1. Dengan membuat interface ini, kita ingin logika bisnis di dalam aplikasi terbebas dari implementasi atau tools luar, sehingga kita bisa bebas menggunakan freamwork/tools apapun.
2. Dengan interface ini, kita bisa menjadikan proses bisnis bersentuhan dengan DB utk save suatu data.
3. Interface merupakan teknik dalam mendefinisikan kemampuan (behavior) objek, tetapi tanpa sebuah implementasi yang nyata, kemampuan tersebut bersifat abstrak. Meskipun kemampuan objek bersifat abstrak, objek interface nyatanya cukup untuk digunakan dalam menentukan alur proses bisnis aplikasi (pada use case).
4. Implementasi konsep interface melalui teknik inheritance class.
5. Interface UserRepository nantinya akan digunakan oleh use case dalam menentukkan alur proses bisnis.
6. Berperan sebagai jembatan untuk memproses domain model terhadap agen eksternal, seperti database, queue, storage, dan sebagainya
7. Buat file UserRepository.js pada Domains/users dan UserRepository.test.js pada Domains/users/_test
8. Kemudian lakukan TDD pada UserRepository.test.js
   - UserRepository adalah objek dengan memiliki kumpulan fungsi yang dapat digunakan untuk interaksi dengan DB
   - Untuk membuat fitur registrasi butuh dua fungsi :
     - addUser : u/ save data user ke DB
     - verifyAvailableUsername : u/ verifikasi keunikan username baru dr database
     - ada 1 test :
       - should throw error when invoke abstract behavior

##### Membuat AddUser Use Case dan PasswordHash Interface
1. Sekali lagi, istilah Domains bisa kita sebut sebagai Enterprise Business Layer.
2. Selanjutnya, kita butuh mendefinisikan alur bisnis (menambah user baru). 
   - CATATATAN : 
     - <strong> SELURUH ALUR BISNIS PADA APLIKASI INI DITULIS DALAM BENTUK USE CASE LEVEL APPLICATIONS (FOLDER Applications) </strong>
     - <strong> Domains dan Applications sebisa mungkin terhindar dari penerapan framework atau tools luar agar mudah diadaptasi bila terjadi perubahan </strong>
     - <strong>Hal ini dilakukan agar code yang ditulis lebih clean</strong>
3. Untuk membuat fitur baru, seorang developer harus memahami apa saja yang dibutuhkan. Fitur yang akan kita buat yaitu <strong>Menambah user baru </strong>
      -  Request handler memanggil use case dan memberikan payload yang dibutuhkan use case (use case payload) seperti username, password, dan fullname
      -  Memverifikasi keunikan username pada database.
      -  Hashing password yang diberikan.
      -  Membuat domain model RegisterUser berdasarkan payload dan password sudah di-hash.
      -  Memasukkan RegisterUser ke database.
   - Nah, untuk hashing password, kita gunakan package bcrypt. Lalu, agar Domains dan Applications terhindar dari penerapan freamwork / tools luar, kita bisa membuat interface untuk Hashing password (PasswordHash).
4. Membuat interface PasswordHash 
   - Buat file PasswordHash.js pada Applications/security dan PasswordHash.test.js pada Applications/security/_test
   - PasswordHash adalah objek yang punya fungsi utk hash yg dibutuhkan o/ use case dengan behaviournya bersifat abstrak dengan punya satu fungsi yaitu hash.
   - Oleh karena itu, utk pengujiannya hnya fokus u/ memastikan fungsi hash membangkitkan error ketika di panggil. 
     - should throw error when invokde abstrack behaviour
5. Membuat AddUserUseCase
   - kita perlu membuat use case dengan tujuan sebagai daftar aksi yang dapat dilakukan oleh aplikasi atau kata lain pada use case kita definisikan step by step apa saja untuk mencapai aksi tersebut. 
   - Oleh karena itu, use case hanya mendefiniskan step by step-nya saja dan tidak mengekskusi pekerjaan yang didefinisikan. 
   - CATATAN =
     - Fungsi dari AddUserUseCase adalah mengatur alur dalam melakukan sebuah aksi. Use case akan mengorkestrasikan atau memandori repository dan service yang digunakan agar aksi tersebut berhasil dilakukan. Ketika melakukan pengujian, tentu kita harus fokus menguji fungsi utama dari sistem yang diuji (SUT). Sehingga pengujian pada use case adalah memastikan ia menjadi mandor yang benar agar aksi “memasukkan user” sesuai dengan alur bisnis yang ditetapkan.
     - AddUserUseCase membutuhkan objek UserRepository dan PasswordHash untuk melakukan tugasnya. Itulah sebabnya kita memberikan dua objek tersebut melalui interface yang sudah dibuat sebelumnya. Karena behavior fungsinya bersifat abstrak, manfaatkanlah Test Double untuk membuat implementasi palsu dari fungsi yang digunakan. 
     - Pada use case, kita membutuhkan teknik Test Double menggunakan mock. Mengapa? Karena selain mengubah implementasi fungsi, kita juga perlu memastikan fungsi tersebut dipanggil dengan tepat oleh use case.
     - <strong>Jadi, dalam use case ini, adalah gambaran dimana fitur register user berjalan, baik ketika sukses maupun gagal</strong>
##### Implementasi User Repository dan PasswordHash
1. Setelah, kita buat entities dan alur bisnis maka kita buat layer Infrastruktur untuk membuat implementasi dari UserRepository dan PasswordHash.
2. Membuat UserRepositoryPostgres.test.js
   - Kita perlu buat UserRepository secara konkrit yang memiliki 2 fitur : fitur addUser dan verfiyAvailableUsername
   - Kedua fitur membutuhkan database sebagi tempat nyimpan dan check data.
   - Buat file UserRepositoryPostgres.js pada Infrastructures/repository dan UserRepositoryPostgres.test.js pada Infrastructures/repository/_test
   - Berhubung UserRepositoryPostgres.js berinteraksi dengan database maka didalam file UserRepositoryPostgres.test.js kita perlu mengimport beberapa file terkait diantaranya :
     - UsersTableTestHelper sebagai helper utk melihat, memasukkan, atau membersihkan data yang dimasukkan ke database selama proses pengujian
     - InvariantError sebagai handle errornya
     - RegisterUser 
     - RegisteredUser 
     - pool sebagai database postgres, dan;
     - UserRepositoryPostgres
   - UserRepositoryPostgres.test.js punya empat (4) buah test
       1. verifyAvailableUsername function should throw InvariantError when username not available
            - pengujian untuk behavior fungsi verifyAvailableUsername. Di pengujian kali ini, kita akan menguji keadaan fungsi ketika username tidak tersedia atau sudah terdaftar di database.
            - Sebelum melakukan pengujian--lebih tepatnya pada bagian Arrange--kita memasukkan data user baru ke database dengan username “amilin” melalui table helper. Hal ini diperlukan untuk memenuhi skenario pengujian bahwa user dengan username “amilin” sudah ada di dalam database. Sehingga, verifyAvailableUsername seharusnya membangkitkan InvariantError.
       2. verifyAvailableUsername function should not throw InvariantError when username available
            - Menguji keadaan di mana username baru dapat digunakan atau belum ada yang menggunakannya di database sehingga Table helper tidak digunakan pada pengujian ini karena tidak dibutuhkan.
       3. addUser function should persist register user
            - Pengujian untuk behavior fungsi addUser. Hal yang diuji yaitu apakah fungsi addUser mampu menyimpan user baru pada database dengan benar. Kita menggunakan UsersTAbleTestHelper.findUsersById untuk menguji apakah user dimasukkan ke database.
       4. addUser function should return added user correctly
            - Fungsi add user juga harus mengembalikan nilai id, username, dan fullname dari user yang baru saja dimasukkan ke database (RegisteredUser). Di sini kita menggunakan table helper untuk melihat apakah data user benar-benar dimasukkan ke dalam database.
3. Skenario test pada UserRepositoryPostgres.test.js ada fungsi afterEach dan afterAll
   - Fungsi afterEach dan afterAll merupakan fungsi yang digunakan untuk menampung sekumpulan kode yang dijalankan setelah melakukan pengujian. Bedanya fungsi afterEach dieksekusi setiap kali fungsi it selesai dijalankan, sedangkan afterAll dieksekusi setelah seluruh fungsi it selesai dijalankan. Biasanya kode yang dituliskan di fungsi ini adalah kode cleaning atau teardown. Untuk mengenal lebih dalam kedua fungsi ini disarankan untuk membaca dokumentasi yang diberikan Jest mengenai [Setup and Teardown](https://jestjs.io/docs/setup-teardown).
   - ada juga fungsi beforeEach dan beforeAll yang sering digunakan untuk meringkas kode testing yang berulang seperti melakukan setup.
4. Membuat UserRepositoryPostgres.js
   ```js
   const InvariantError = require('../../Commons/exceptions/InvariantError');
   const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
   const UserRepository = require('../../Domains/users/UserRepository');

   class UserRepositoryPostgres extends UserRepository {
      constructor(pool, idGenerator) {
         super();
         this._pool = pool;
         this._idGenerator = idGenerator;
      }

      async verifyAvailableUsername(username) {
         const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
         };

         const result = await this._pool.query(query);

         if (result.rowCount) {
            throw new InvariantError('username tidak tersedia');
         }
      }

      async verifyAvailableUsername(username) {
         const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
         };

         const result = await this._pool.query(query);

         if (result.rowCount) {
            throw new InvariantError('username tidak tersedia');
         }
      }

      async addUser(registerUser) {
         const { username, password, fullname } = registerUser;
         const id = `user-${this._idGenerator()}`;

         const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
            values: [id, username, password, fullname],
         };

         const result = await this._pool.query(query);

         return new RegisteredUser({ ...result.rows[0] });
      }
   }

   module.exports = UserRepositoryPostgres;
   ```
5. Membuat BcryptPasswordHash
   - Package yang akan kita gunakan yaitu bcrypt dengan membuat objek dengan nama BcryptPasswordHash sehingga nama file yang kita buat BcryptPasswordHash.js pada Infrastructures/security dan BcryptPasswordHash.test.js pada Infrastructures/security/_test
6. Pada BcryptPasswordHash.test.js akan diuji mengenai should encrypt password correctly sehingga test ini akan menguji kebenaran dari fungsi hash dalam mengenkripsi password menggunakan bcrypt. Di sini, kita menggunakan teknik spy untuk melihat apakah fungsi hash dari bcrypt dipanggil dan diperlakukan dengan benar. Di sini juga kita memastikan nilai “plain_password” sudah terenkripsi.

##### Membuat Service Locator
1. dengan membuat UserRepositoryPostgres dan BcryptPasswordHash kita telah membuat sebuah pengujian otomatis. 
2. Lalu, kita perlu membuat HTTP server menggunakan repository, use case, dan helper. Namun, ada beberapa hal yang harus diperhatikan.
   - Dampak penerapan Dependency Injection yaitu  hubungan antar objek tidak saling terikat erat, dengan begitu kita dapat menciptakan arsitektur yang clean dan mudah menerapkan test double ketika pengujian.
3. <strong>Service locator</strong> merupakan objek yang berfungsi untuk mengabstraksikan pembuatan dan pengaksesan sebuah instance class. Sesuai namanya, ketika menggunakan service locator, kita bisa mendapatkan instance secara mudah karena ia berada di satu lokasi saja. Karena service locator menampung banyak instance di dalamnya, ia juga berfungsi sebagai service container.
   - Instal instances-container  : [npm install instances-container](https://github.com/dimasmds/instances-container)
   - Buat file conatiner.js pada Infrastructures yang berfungsi untuk mendaftarkan seluruh use case dan services
   - Selain instances-container,  bisa menggunakan package lain dalam menerapkan service locator seperti: [Awilix](https://github.com/jeffijoe/awilix) atau [Bottlejs](https://github.com/young-steveo/bottlejs)
  
##### Membuat HTTP Server dan Functional Test
1. Menguji seluruh fungsionalitas aplikasi dari hulu ke hilir. Di sini kita akan membuat HTTP server dan pengujiannya terlebih dahulu. Buat file createServer.js pada Infrastructures/http dan createServer.test.js pada Infrastructures/http/_test.
2. Skenario pertama yaitu ketika user mendaftar dengan benar.
   - Import pool, UsersTableTestHelper, container, dan createServer
   - Gunakan :
   ```js
      afterAll(async () => {
         await pool.end();
      });
      
      afterEach(async () => {
         await UsersTableTestHelper.cleanTable();
      });
   ```  
3. Fungsi handler (postUserHandler) dalam kode tersebut tidak ada lagi logika yang dituliskan selain untuk merespons permintaan karena semua logic akan ditangani oleh use case. Handler memanggil fungsi execute dari use case dan memberikan request.payload sebagai payload use case. Handler memiliki akses terhadap instance use case melalui container yang akan dikirim oleh HTTP server melalui plugin options. Perhatikan juga bahwa untuk mendapatkan instance dari container, kita menggunakan fungsi getInstance(key). Lalu, Simpan berkas handler.js. Kemudian kita lanjut untuk membuat plugin users.

##### Menerjemahkan Domain Error ke HTTP Error
1. Terdapat 5 jenis error : 
   1. should response 400 when request payload not contain needed property.
   2. should response 400 when request payload not meet data type specification.
   3. should response 400 when username more than 50 character.
   4. should response 400 when username contain restricted character.
   5. should response 400 when username unavailable.
2. Pada domain, lebih tepatnya entities RegisterUser, telah ditulis verifikasi payload yang diberikan, seperti mengecek kelengkapan properti, tipe data, dan spesifikasi username.
3. Untuk sementara status errornya masih 500 karena Error yang dibangkitkan tidak ditangani oleh server.  Error yang dibangkitkan oleh domain model RegisterUser adalah generic error. Ia tidak memiliki status code yang digunakan sebagai nilai response code. Lalu, bagaimana cara server dapat menangani eror tersebut dengan benar? Tidak ada cara lagi selain menerjemahkan domain eror menjadi HTTP error.
4. Ingat! Tidak semua eror yang ada di Domains dan Applications perlu diterjemahkan. Salah satu eror yang dapat diterjemahkan adalah yang disebabkan oleh kesalahan client. Contohnya, eror yang dibangkitkan pada proses verifikasi payload RegisterUser. Sementara itu, error seperti abstrak method yang belum diimplementasi tidak perlu diterjemahkan karena eror tersebut ditujukan untuk pengembang aplikasi (developer).
5. Bagaimana cara menerjemahkannya? Kita dapat memetakan secara manual setiap domain eror yang memang perlu diterjemahkan. Setiap eror yang dibangkitkan pada folder Domains dan Applications selalu memberikan format pesan yang jelas. Pesan tersebut akan kita manfaatkan sebagai kunci dalam menerjemahkan domain eror menjadi HTTP Error. Oleh karena itu, mari kita buat penerjemah error tersebut dengan nama DomainErrorTranslator. Silakan buat berkas JavaScript baru bernama DomainErrorTranslator.js pada Commons/exceptions/ dan DomainErrorTranslator.test.js pada Commons/exceptions/_test/
   - Code  DomainErrorTranslator.js
   ```js
   const InvariantError = require('./InvariantError');

   const DomainErrorTranslator = {
      translate(error) {
         switch (error.message) {
            case 'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY':
            return new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
            case 'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION':
            return new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai');
            case 'REGISTER_USER.USERNAME_LIMIT_CHAR':
            return new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit');
            case 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER':
            return new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang');
            default:
            return error;
         }
      },
   };

   module.exports = DomainErrorTranslator
   ```
   - code diatas masih bisa di refactor menjadi :
   ```js
   const InvariantError = require('./InvariantError');
   const DomainErrorTranslator = {
   translate(error) {
      return DomainErrorTranslator._directories[error.message] || error;
   },
   };
   
   DomainErrorTranslator._directories = {
      'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
      'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
      'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
      'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
   };
   
   module.exports = DomainErrorTranslator;
   ``` 
6. Lalu, terapkan DomainErrorTranslator ke file handler.js
7. Tambahkan pengujian baru pada createServer.test.js dengan skenario membangkitkan server error. Untuk membangkitkannya, berikan saja container palsu pada pembuatan server.
8. Kemudian, kita menjalankan HTTP server pada app.js agar fitur tersebut dapat digunakan melalui permintaan HTTP. Lalu menggunakan teknik [extensions function](https://hapi.dev/api?v=20.2.0#-serverextevents) ketika siklus onPreResponse pada server Hapi. Fungsi extensions ini akan terpanggil sebelum server Hapi merespon sebuah permintaan. Dalam fungsi extension ini, kita bisa mengubah respons sebelum ia dikirim ke client. Dengan begitu, kita bisa mengintervensi response--khususnya response error--dengan penanganan eror sesuai kebutuhan. Buka berkas createServer.js dan tulis kode extensions function untuk siklus onPreResponse tepat sebelum mengembalikan nilai server.
   - Import ClientError dan DomainErrorTranslator
   - Kemudian, hapus penanganan error agar lebih rapi. 
9. Lalu, kita terapkan penanganan erornya ketika mengakses endpoint yang tidak terdaftar, secara native Hapi akan mengembalikan 404 eror. Buat test pada file createServer.test.js
10. Ketika Hapi server hendak mengembalikan response yang merupakan eror, response tersebut memiliki properti isServer. Properti tersebut mengindikasikan apakah error merupakan client atau server. Jika eror tersebut merupakan client, kita bisa mengembalikan dengan response asli tanpa ada proses intervensi. Hal tersebut karena kita ingin mempertahankan behavior Hapi dalam menangani client error. Namun, jika erornya server, response akan terintervensi dengan penanganan server error yang kita tetapkan.

##### Menjalankan HTTP Server
1. Apa yang telah kita buat, belum dapat berjalan secara web server karena baru berjalan dalam lingkungan unit test dalam kata lain automotion testing sudah dapat berjalan. 
2. Masuk ke dalam file app.js
   - code :
   ```js
   require('dotenv').config()
   const createServer = require('./Infrastructures/http/createServer')
   const container = require('./Infrastructures/container')

   const start = async() => {
      const server = await createServer(container)
      await server.start()
      console.log(`Server start ad ${server.info.uri}`);
   }

   start()
   ``` 
#### TIPS MEMBANGUN FITUR BARU
1. Kebutuhan bisnis seperti domain model dan repository interface + unit testing.
2. Alur bisnis atau use case dan service interface yang dibutuhkan use case + unit testing.
3. Kebutuhan infrastruktur seperti database (termasuk pembuatan tabel jika diperlukan), repository concrete, service concrete + integration testing
4. Kebutuhan interface HTTP server seperti routing dan handler + functional test

##### Membangun Fitur Login
1. Kita buat sebuah fitur login, dengan membuat file LoginUser.js pada Domains/users/entities dan LoginUser.test.js pada Domains/uses/entities/_test 
   - ada 3 skenario test yaitu, jika ada request / property tidak tersedia, jika type data tidak sesuai, dan login berhasil (correctly).
   - setelah membuat test untuk user login, maka buat file dan fungsi loginUser. Fungsi yang diterapkan sebagaimana yang ada di test. 
   - Terdapat 3 test yaitu :
       - should throw error when payload does not contain needed property
       - should throw error when payload not meet data type specification
       - should login correctly
2. Dalam menjalankan login, kita butuh authentication. Terlebih dahulu kita buat entities dengan nama file NewAuth.js pada Domains/authentications/entities dan NewAuth.test.js pada Domains/authentications/entities/_test
   - terdapat 3 test yang dilakukan :
       - should throw error when payload does not contain needed property
       - should throw error when payload not meet data type specification
       - should create NewAuth entities correctly
3. Kemudian, buat repository untuk authentication dengan nama file AuthenticationRepository.js pada Domains/authentications dan AuthenticationRepository.test.js Domains/authentications/_test. untuk pengujian ada 1 yaitu should throw error when invoke unimplemented method dengan expect ada 3 yaitu untuk 3 fungsi addToken, checkAvailabilityToken, dan deleteToken
4. Selanjutnya kita beralih ke Folder <strong>Applications</strong> Disini kita akan implementasikan use case fitur login. Karena kita menggunakan token sebagai sebuah security maka kita buat AuthenticationTokenManager.js pada Applications/security dan AuthenticationTokenManager.test.js pada Applications/securiy/_test. Terdapat 4 fungsi yaitu createAccessToken, createRefreshToken, verifyRefreshToken dan decodePayload
5. Sekarang kita beralih ke use case nya. Dalam penerapannya akan sedikit kompleks ya.. Buat file LoginUserUseCase.js pada Applications/use_case dan LoginUserUseCase.test.js pada Applications/use_case/_test.
      - dalam file LoginUserUseCase.test.js dibutuhkan UserRepository, AuthenticationRepository, AuthenticationTokenManager, PasswordHash, LoginUserUseCase, dan NewAuth
6. Owh ya, jangan lupa kita buat exception untuk authorization-nya. Buat file AuthorizationError.js pada Commons > exceptions dan file AuthorizationError.test.js pada Commons > exceptions > test
7. Kalau liat catatan diatas, kita telah buat file DomainErrorTranslator.js. Nah, sekarang kita tambahkan untuk fitur loginnya. 
      - code tambahannya
      ```js
        'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
      'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
      ``` 

8. Kita sekrang ke bagian folder Infrastructures
   1. Berlanjut ke repository > UserRepositoryPostgres.js : disini kita akan memberikan kode agar request / respons ke DB berjalan. Tambahkan fungsi getPasswordByUsername dan getIdByUsername
   2. Lalu, karena kita punya Authorization and Authentifikasi yang mana terdapat token. Maka kita tambahkan juga file AuthenticationRepositoryPostgres.js dan AuthenticationRepositoryPostgres.test.js untuk melakukan testnya.
   3. next, kita buat untuk securitynya yaitu file JwtTokenManager.js pada folder security dan jangan lupa juga testnya ya...
   4. Lakukan update juga untuk BcrypPasswordHash.js beserta test nya. dengan membuat function comparePassword yang disertai throw error ke AuthenticationError pastikan parent nya PasswordHash juga memiliki function comparePassword

9. Selanjutnya, beralih ke container.js 
10.  Kemudian kita beranjak ke folder Interfaces
    1.  
# バックエンドテスト実行のための手動設定

## 問題の状況

バックエンドテストを作成しましたが、`@DataJpaTest`で使用するH2インメモリデータベースの依存関係が不足しているため、テストが実行できません。

AIによるXML編集で問題が発生したため、手動で追加をお願いします。

---

## 手順: H2データベース依存関係の追加

### 1. `pom.xml`を開く

`imadoko_back/pom.xml`を開いてください。

### 2. 以下の依存関係を追加

`spring-boot-starter-test`の**直後**に、以下を追加してください：

```xml
\t\t<dependency>
\t\t\t<groupId>com.h2database</groupId>
\t\t\t<artifactId>h2</artifactId>
\t\t\t<scope>test</scope>
\t\t</dependency>
```

### 3. 追加位置の例

```xml
\t\t<dependency>
\t\t\t<groupId>org.springframework.boot</groupId>
\t\t\t<artifactId>spring-boot-starter-test</artifactId>
\t\t\t<scope>test</scope>
\t\t</dependency>
\t\t<dependency>
\t\t\t<groupId>com.h2database</groupId>
\t\t\t<artifactId>h2</artifactId>
\t\t\t<scope>test</scope>
\t\t</dependency>

\t\t<dependency>
\t\t\t<groupId>org.openapitools</groupId>
\t\t\t<artifactId>jackson-databind-nullable</artifactId>
\t\t\t<version>0.2.6</version>
\t\t</dependency>
```

### 4. 保存後、テストを実行

```bash
cd d:\aaaaaaaaaaa\imadoko-rota2\imadoko_back
.\tools\apache-maven-3.9.6\bin\mvn.cmd test
```

---

## 期待される結果

✅ **18個のテストが全てPASS**:
- `TeamRepositoryTest`: 4テスト
- `TeamServiceTest`: 7テスト  
- `TeamControllerTest`: 7テスト

---

## 補足

- H2データベースは`<scope>test</scope>`なので、テスト実行時のみ使用されます
- 本番環境のPostgreSQLには一切影響しません
- 既存のコードは一切変更していません（テストコードのみ追加）

---

完了したらお知らせください！

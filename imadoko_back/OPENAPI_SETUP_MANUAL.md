# Backend OpenAPI自動生成 - 手動セットアップ手順

## 問題の状況

AIによるXMLファイルの自動編集でエスケープ文字の問題が発生しました。
以下の手順で手動セットアップをお願いします。

---

## 手順1: 必要な依存関係を追加

`imadoko_back/pom.xml`を開き、`<dependencies>`セクション内の**最後**(spring-boot-starter-testの下)に以下の2つの依存関係を追加してください：

```xml
\t\t<!-- OpenAPI Generator用の依存関係 -->
\t\t<dependency>
\t\t\t<groupId>org.openapitools</groupId>
\t\t\t<artifactId>jackson-databind-nullable</artifactId>
\t\t\t<version>0.2.6</version>
\t\t</dependency>
\t\t<dependency>
\t\t\t<groupId>io.swagger.core.v3</groupId>
\t\t\t<artifactId>swagger-annotations</artifactId>
\t\t\t<version>2.2.19</version>
\t\t</dependency>
\t</dependencies>
```

---

## 手順2: OpenAPI Generator Pluginを追加

`<build><plugins>`セクション内のspring-boot-maven-pluginの**直後**に、以下のプラグイン設定を追加してください：

```xml
\t\t\t<!-- OpenAPI自動生成プラグイン -->
\t\t\t<plugin>
\t\t\t\t<groupId>org.openapitools</groupId>
\t\t\t\t<artifactId>openapi-generator-maven-plugin</artifactId>
\t\t\t\t<version>7.1.0</version>
\t\t\t\t<executions>
\t\t\t\t\t<execution>
\t\t\t\t\t\t<goals>
\t\t\t\t\t\t\t<goal>generate</goal>
\t\t\t\t\t\t</goals>
\t\t\t\t\t\t<configuration>
\t\t\t\t\t\t\t<!-- OpenAPI仕様ファイルのパス -->
\t\t\t\t\t\t\t<inputSpec>${project.basedir}/../openapi.yaml</inputSpec>
\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<!-- 生成言語: Spring Boot -->
\t\t\t\t\t\t\t<generatorName>spring</generatorName>
\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<!-- 出力先ディレクトリ -->
\t\t\t\t\t\t\t<output>${project.build.directory}/generated-sources</output>
\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<!-- 生成対象: APIインターフェースとモデルのみ -->
\t\t\t\t\t\t\t<apiPackage>com.c.imadoko.imadoko_back.api.generated</apiPackage>
\t\t\t\t\t\t\t<modelPackage>com.c.imadoko.imadoko_back.api.generated.model</modelPackage>
\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<!-- 既存のControllerは手動実装（インターフェースのみ生成） -->
\t\t\t\t\t\t\t<configOptions>
\t\t\t\t\t\t\t\t<interfaceOnly>true</interfaceOnly>
\t\t\t\t\t\t\t\t<useSpringBoot3>true</useSpringBoot3>
\t\t\t\t\t\t\t\t<useTags>true</useTags>
\t\t\t\t\t\t\t\t<skipDefaultInterface>false</skipDefaultInterface>
\t\t\t\t\t\t\t</configOptions>
\t\t\t\t\t\t</configuration>
\t\t\t\t\t</execution>
\t\t\t\t</executions>
\t\t\t</plugin>
\t\t</plugins>
\t</build>
```

---

## 手順3: Mavenビルドを実行

pom.xmlを保存したら、コマンドプロンプトで以下を実行してください：

```bash
cd d:\aaaaaaaaaaa\imadoko-rota2\imadoko_back
.\tools\apache-maven-3.9.6\bin\mvn.cmd clean compile
```

成功すれば、`target/generated-sources`ディレクトリにJavaコードが生成されます。

---

## 参考: pom.xml.patchファイル

完全な設定内容は`pom.xml.patch`ファイルにも記載されています。

---

## 期待される結果

- ✅ Mavenビルドが成功
- ✅ `target/generated-sources/src/main/java/com/c/imadoko/imadoko_back/api/generated/` にAPIインターフェースが生成される
- ✅ `target/generated-sources/src/main/java/com/c/imadoko/imadoko_back/api/generated/model/` にモデルクラスが生成される

---

## トラブルシューティング

もしコンパイルエラーが出た場合は、エラーメッセージをそのまま共有してください。依存関係のバージョン調整が必要な可能性があります。

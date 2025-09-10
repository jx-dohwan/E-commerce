# 3주차 과제 질문 리스트

## 1. 인증 구현
- 인증을 구현하였으나 아직 구동 원리가 머릿속으로 그려지지가 않는다.

## 2. 인가 구현
- 인가를 서비스에도 따로 적용 해야되나, GPT한테 물어보니 service에도 뭔가를 적용하기는 하던데 잘 이해는 안된다. 아래가 그 코드이다. 

```
  async remove(postId:Post['id'], requester: {sub: string; role: Role}) {
    const post = await this.postsRepository.findOne(postId);
    if (!post) throw new NotFoundException('post not found');

    const isOwner = post.user?.id === requester.sub;
    const isAdmin = requester.role === Role.Admin;

    if (!isOwner && !isAdmin) throw new ForbiddenException('not allowed');

    await this.postsRepository.remove(postId);
    return {ok: true};
  }
```

### 3. 전역 예외 처리
- 모든 예외를 HTTP 응답 형태로 변환하여서 서버 로그에는 요청 정보와 스택 기록을 저장하였는데, 더 필요한 부분이 있을까?

### 4. 전체 프로젝트의 프로세스 흐름
- 전체 프로젝트의 프로세스 흐름을 아직 잘 모르겠다.
- 멘토님의 코드를 보니 객체지향으로 잘 구현해 놓으셨는데, 프로세스가 머릿속에 그려지지 않는다.


### 5. 주말 출근으로 시간이 부족해 redis, 추상화 알림 서비스는 구현하지 못했다.
- 과제 수행을 위해서 살펴보기는 하였으나, 결론적으로 주말 출근으로 시간이 너무 많이 빼앗겨서 해당 과제를 진행하지는 못했다.

# 2주차 과제 질문 리스트

## 1. 카테고리 삭제 시 상품 처리
- Category와 Product를 조인했을 때, 도메인적으로 카테고리를 삭제하면 연결된 Product도 함께 삭제되도록 `CASCADE`로 설정하는 것이 맞을까요?  
- 현업에서는 보통 어떤 방식으로 처리하는지 궁금합니다.  

## 2. 상품 생성 시 카테고리 매칭
- 상품을 생성할 때 `categoryId`로 매칭하는 대신, 카테고리 이름을 선택하면 해당 이름으로 `categoryId`를 찾아 반영되게 하려면 Repository에 도메인 특화 메서드를 따로 만들어야 할까요?  

## 3. Config와 Joi 차이
- Config 설정에서 `joi`도 많이 사용하는데, 현재 코드 방식과는 어떤 차이가 있나요?  
- 실무에서는 어떤 접근을 더 많이 쓰는지 궁금합니다.  

## 4. 로깅 기준
- 로그에 어떤 정보들을 기록할지 선정한 기준은 무엇인가요?  
- 현업에서는 추가로 어떤 정보들을 남기는 편인가요?  

## 5. 도메인 특화 로직과 프론트 요구사항
- 도메인 특화 로직을 프론트 요구사항에 맞게 구성할 때 어떤 점을 고려하는 게 좋을까요?  

## 6. Repository와 Service 구분
- Repository와 Service의 로직이 비슷해 보이는데, 굳이 나눠서 사용하는 이유가 있나요?  
- 단순 CRUD가 아니라 도메인 복잡도가 올라갔을 때 어떤 장점이 있는지 궁금합니다.  


//즉시실행 함수
(() => {

    //window.pageYOffset 대신 쓸 수 변수
    let yOffset = 0;

    //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 높이값의 합
    let prevScrollHeight = 0;

    //현재 활성화 된(눈 앞에 보고 있는) 씬(scroll-section)
    let currentScene = 0;



    //기기에 따른 스크롤 section에 따른 배열 생성
    const sceneInfo = [
        {
            tpye: "sticky",
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 설정
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-0")
                , messageA: document.querySelector("#scroll-section-0 .main-message.a")
                , messageB: document.querySelector("#scroll-section-0 .main-message.b")
                , messageC: document.querySelector("#scroll-section-0 .main-message.c")
                , messageD: document.querySelector("#scroll-section-0 .main-message.d")
            }
            , values: {
                // messageA_opacity: [200, 900]
                messageA_opacity: [0, 1]
                ,
            }
        },
        {
            tpye: "normal",
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 설정
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-1")
            }
        },
        {
            tpye: "sticky",
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 설정
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-2")
            }
        },
        {
            tpye: "sticky",
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 설정
            scrollHeight: 0,
            objs: {
                container: document.querySelector("#scroll-section-3")
            }
        },
    ];

    function setLayout() {


        //각 스크롤 섹션의 높이 셋팅
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        //current Scene을 자동 setting
        //현재 스크롤 높이
        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            //전체 scroll 높이
            totalScrollHeight += sceneInfo[i].scrollHeight;

            //for문을 돌면서 섹션의 스크롤 높이의 합보다 현재 스크롤 높이보다 크면 해당하는 페이지 스크롤에서 stop
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }


    function scrollLoop() {

        prevScrollHeight = 0;

        //전체 scene의 높이의 합
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        //current scene에 따라서 값 변동
        //현재 스크롤 값이 이전 섹션의 height 값 보다 클 경우 == 다음 section이라는 소리
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            //그럼 현재 페이지  증가
            currentScene++;

            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (yOffset < prevScrollHeight) {
            currentScene--;

            document.body.setAttribute('id', `show-scene-${currentScene}`);

            //초기 페이지에서 위로 올렸을 경우 종료
            if (yOffset < prevScrollHeight) {
                return;
            }
        }

        playAnimation();
    }


    //values : 각 변화의 시작값과 끝 값
    //currentYOffset : 현재 섹션 안에서 스크롤이 얼마나 됐는지
    function calcValues(values, currentYOffset) {
        let rv;

        //현재 섹션의 스크롤 된 범위를 비율로 반환
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;


        // 0,1고정이 아니라고 한다면, 예를들어 messageA_opacity가 200~900 까지의 범위를 가질 경우, 그 사이의 범위는 700이다.
        // 단, 0~700이 아닌 200부터 시작하여 700만큼 범위를 가져야 900 만큼 이동한다 이걸 식으로 표현하면
        rv = scrollRatio * (values[1] - values[0]) + values[0];

        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        //현재 스크롤 높이 - 이전 스크롤들의 높이합  = 각 섹션에서의 높이 값
        const currentYOffset = yOffset - prevScrollHeight;


        // 스크롤 값에 따라서 해당 타겟의 투명도 조절
        switch (currentScene) {
            case 0:
                // calcValues();
                //어디서 부터 시작하는지에 대한 값들 저장
                let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);

                console.log(objs.messageA);

                //투명도 설정
                objs.messageA.style.opacity = messageA_opacity_in;

                break;

            case 1:
                console.log("1")
                break;
            case 2:
                console.log("2")
                break;
            case 3:
                console.log("3")
                break;

        }


    }

    //윈도우 사이즈 조정 시 같이 height 값이 바뀌도록 설정
    window.addEventListener("resize", setLayout);
    window.addEventListener("scroll", () => {
        yOffset = window.pageYOffset;

        scrollLoop();
    });

    window.addEventListener('load', setLayout);

})();
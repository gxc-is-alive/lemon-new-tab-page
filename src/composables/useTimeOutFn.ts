import { SendNotification } from '@/composables/useNotification';
import { useTimeoutFn } from '@vueuse/core';
import { type Ref, ref } from 'vue';

interface TimeOutOption {
    time: number;
}

export const isPending: Ref<boolean> = ref(false);
export let start = () => {};
export let stop = () => {};

export const reStart = ({
    time = 1000 * 60 * 30
}: TimeOutOption) => {
    const timeoutFn = useTimeoutFn(() => {
        console.log('该休息了')
        SendNotification({
            message: '该休息了'
        });
    }, time);

    // 更新外部变量
    isPending.value = timeoutFn.isPending.value;
    start = timeoutFn.start;
    stop = timeoutFn.stop;

    return { isPending, start, stop };
};

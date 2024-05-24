<template>

    <div class="min-h-screen w-full max-w-[1200px] mx-auto relative z-10 pt-20 pb-24">
        <div class="mt-20 p-4 border rounded-2xl bg-[#f8fcfe]">
            <div class="flex flex-col w-full">
                <h1 class="text-3xl text-center">Check The Social Existence Of A Username, Product Or Brand!</h1>
                <div class="mx-auto w-full">
                    <div class="relative mt-4">
                        <input v-model="username" type="text" class="h-[60px] w-full border focus:outline-none pl-2 text-2xl">
                        <div @click="handleSubmit()" class="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer">
                            <img class="w-[50px]" src="/assets/search-2.svg" alt="">
                        </div>
                    </div>
                    <div class="ml-auto w-fit">
                        <div class="g-recaptcha mt-5" data-sitekey="6Lf2wLgnAAAAAAyelpUjpxzAHH9y8ea1k8FrtvCV"></div>
                        <div v-if="error != ''" class="text-[#fc064c] text-right mt-2">{{ error }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-4 mt-20">
            <h1 class="text-3xl text-center">The Platforms we support. More to come</h1>
            <div class="p-4 border rounded-2xl w-full max-w-[1200px] grid grid-cols-3 bg-[#f8fcfe] gap-4">
                <div @click="handlePlatformClick(platform)" v-for="(platform, index) in platforms" :key="index" class="col-span-1 border rounded-2xl p-4 bg-white each-platform cursor-pointer" :class="platform.status">
                    <div class="flex">
                        <div class="flex flex-col gap-2">
                            <div class="w-[66px] h-[66px] p-[2px] rounded-full border flex">
                                <img class="m-auto" :src="`/assets/social-icons/${platform.icon}`" alt="">
                            </div>
                            <div class="font-medium text-xl">{{ platform.name }}</div>
                        </div>
                        <div v-if="platform.status" class="ml-auto">
                            <div v-if="platform.status == 'fetching'">
                                <img class="w-[40px]" src="/assets/loader.gif" alt="">
                            </div>
                            <div v-else class="status-card flex items-center py-1 px-3 rounded-lg gap-2 border">
                                <img class="w-[24px]" :src="`/assets/${getPlatformStatusIcon(platform)}`" alt="">
                                <div>{{ getPlatformStatus(platform) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import { Platform as PlatformType } from '@/types/platform.ts'
// @ts-ignore
import Platform from '@/composables/Platform.ts'

const username = ref<string>('')
const error = ref<string>('')
const { getAvailability } = Platform()
const platforms = ref<PlatformType[] | []>([
    {id: 1, name: 'Facebook', icon: 'facebook.png', url: 'https://www.facebook.com', status: null},
    {id: 2, name: 'Instagram', icon: 'instagram.png', url: 'https://www.instagram.com', status: null},
    {id: 5, name: 'YouTube', icon: 'youtube.png', url: 'https://www.youtube.com', status: null},
    {id: 15, name: 'X / Twitter', icon: 'x.png', url: 'https://twitter.com', status: null},
    {id: 3, name: 'LinkedIn', icon: 'linkedin.png', url: 'https://www.linkedin.com', status: null},
    {id: 6, name: 'Pinterest', icon: 'pinterest.png', url: 'https://www.pinterest.com', status: null},
    {id: 4, name: 'Twitch', icon: 'twitch.png', url: 'https://www.twitch.tv', status: null},
    {id: 9, name: 'Ask FM', icon: 'askfm.png', url: 'https://ask.fm', status: null},
    {id: 18, name: 'Patreon', icon: 'patreon.png', url: 'https://www.patreon.com', status: null},
    {id: 7, name: 'Fiverr', icon: 'fiverr.png', url: 'https://www.fiverr.com', status: null},
    {id: 11, name: 'SoundCloud', icon: 'soundcloud.png', url: 'https://soundcloud.com', status: null},
    {id: 10, name: 'Medium', icon: 'medium.png', url: 'https://www.medium.com', status: null},
    {id: 20, name: 'Kickstarter', icon: 'kickstarter.png', url: 'https://www.kickstarter.com', status: null},
    {id: 17, name: 'GitHub', icon: 'github.png', url: 'https://github.com', status: null},
    {id: 12, name: 'Bandcamp', icon: 'bandcamp.png', url: 'https://www.bandcamp.com', status: null},
    {id: 8, name: 'Imgur', icon: 'imgur.png', url: 'https://imgur.com', status: null},
    {id: 13, name: 'Gravatar', icon: 'gravatar.png', url: 'https://gravatar.com', status: null},
    {id: 14, name: 'Dribbble', icon: 'dribbble.png', url: 'https://www.dribbble.com', status: null},
    {id: 16, name: 'AboutMe', icon: 'empty.png', url: 'https://about.me', status: null},
    {id: 19, name: 'Disqus', icon: 'disqus.png', url: 'https://www.disqus.com', status: null},
])

const loadScript = (src: string, callback: any) => {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.onload = callback
    document.head.appendChild(script)
}

loadScript('https://www.google.com/recaptcha/api.js', function () {})

const getPlatformStatus = (platform: PlatformType) => {
    if (platform.status == 'taken') {
        return 'Taken'
    } else if (platform.status == 'available') {
        return 'Available'
    } else if (platform.status == 'suspended') {
        return 'Suspended'
    } else if (platform.status == 'special_charac_not_allowed') {
        return 'Unsupported character'
    } else if (platform.status == 'upper_case_letters_not_allowed') {
        return 'Upper case not allowed'
    } else if (platform.status == 'too_little_characters') {
        return 'Too little characters'
    } else if (platform.status == 'too_many_characters') {
        return 'Too many characters'
    } else if (platform.status == 'must_contain_letter') {
        return 'Must contain letter'
    } else if (platform.status == 'is_inappropriate') {
        return 'Inappropriate characters'
    } else if (platform.status == 'is_inappropriate') {
        return 'Unknown status'
    }

    return ''
}

const getPlatformStatusIcon = (platform: PlatformType) => {
    if (platform.status == 'taken') {
        return 'close.svg'
    } else if (platform.status == 'available') {
        return 'stars.svg'
    } else if (platform.status == 'suspended') {
        return 'stop.svg'
    } else if (platform.status == 'special_charac_not_allowed') {
        return 'warning.svg'
    } else if (platform.status == 'upper_case_letters_not_allowed') {
        return 'warning.svgd'
    } else if (platform.status == 'too_little_characters') {
        return 'warning.svg'
    } else if (platform.status == 'too_many_characters') {
        return 'warning.svg'
    } else if (platform.status == 'must_contain_letter') {
        return 'warning.svg'
    } else if (platform.status == 'is_inappropriate') {
        return 'warning.svg'
    } else if (platform.status == null) {
        return 'warning.svg'
    }

    return ''
}

const startFetchingStatus = async () => {

    for (const platform of platforms.value) {

        platform.status = 'fetching'
        try {
            const response = await getAvailability(platform.id, platform.url, username.value)
            platform.status = response?.data.isAvailable.status
            platform.url = response?.data.isAvailable.status !== null ? response?.data.isAvailable.url : platform.url

            if (platform.id == 3 && response?.data.isAvailable.status == null) {
                const response = await getAvailability(platform.id, platform.url, username.value, true)
                platform.status = response?.data.isAvailable.status
                platform.url = response?.data.isAvailable.url
            }
        } catch (error) {
            console.error(`Error processing platform ${platform.name}:`, error)
        }
    }
}

const handlePlatformClick = (platform: PlatformType) => {

    if(platform.status) {
        window.open(platform.url, '_blank')
    }
}

const handleSubmit = () => {

    error.value = ''

    if(username.value == ''){
        error.value = 'Username cannot be empty'
    }// @ts-ignore
    else if (!grecaptcha.getResponse()) {
        error.value = 'Please complete google recaptcha'
    } else {
        startFetchingStatus()
    }
}

</script>
